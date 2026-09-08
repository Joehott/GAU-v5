import contextlib
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import sqlite3
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]

def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m

g = module('gau', ROOT / 'payload/runtime/gau.py')
ins = module('installer', ROOT / 'install.py')

class IntegrationTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name) / 'project'
        self.root.mkdir()
        (self.root / 'app.py').write_text('x=1\n', encoding='utf-8')
        (self.root / 'helper.py').write_text('y=1\n', encoding='utf-8')
        self.s = g.Store(self.root)
        self.mid = g.new_mission(self.s, {
            'goal': 'Fix behavior',
            'risk': 'high',
            'requirements': [{'id': 'R1', 'text': 'Behavior works'}]
        })['id']

    def tearDown(self):
        self.s.close()
        self.tmp.cleanup()

    def evidence(self, files=None):
        spec = {'requirements': ['R1'], 'verifier': 'worker', 'criterion': 'Real successful process'}
        if files is not None:
            spec['files'] = files
        return g.verify(self.s, self.mid, spec, [sys.executable, '-c', 'assert 1+1==2'])

    def cli(self,*args):
        return subprocess.run(
            [sys.executable, str(ROOT / 'payload/runtime/gau.py'), '--project', str(self.root), *args],
            capture_output=True, text=True, encoding='utf-8'
        )

    def spec(self, name, data):
        p = self.root / '.gau' / name
        p.write_text(json.dumps(data), encoding='utf-8')
        return str(p)

    def test_missing_proof_then_pass_then_stale(self):
        self.assertEqual(self.s.gate(self.mid)['status'], 'INCOMPLETE')
        self.evidence()
        self.assertEqual(self.s.gate(self.mid)['status'], 'COMPLETE')
        (self.root / 'new.py').write_text('new=True', encoding='utf-8')
        self.assertEqual(self.s.gate(self.mid)['status'], 'INCOMPLETE')

    def test_log_tamper_invalidates_proof(self):
        e = self.evidence()
        (self.root / e['log']).write_text('tampered', encoding='utf-8')
        self.assertFalse(self.s.fresh(e))

    def test_failure_requires_explicit_resolution(self):
        spec = {'requirements': ['R1'], 'verifier': 'worker', 'criterion': 'process'}
        bad = g.verify(self.s, self.mid, spec, [sys.executable, '-c', 'raise SystemExit(1)'])
        self.evidence()
        self.assertEqual(self.s.gate(self.mid)['status'], 'INCOMPLETE')
        g.verify(self.s, self.mid, dict(spec, resolves=[bad['id']]), [sys.executable, '-c', 'pass'])
        self.assertEqual(self.s.gate(self.mid)['status'], 'COMPLETE')

    def test_task_evidence_and_dependencies_revalidate(self):
        a = g.task_add(self.s, self.mid, {'text': 'A', 'owner': 'worker'})
        b = g.task_add(self.s, self.mid, {'text': 'B', 'owner': 'worker', 'dependencies': [a['id']]})
        e = self.evidence()
        with self.s.tx():
            self.s.put(self.mid, 'task_status', {'task': a['id'], 'status': 'DONE', 'evidence': [e['id']]})
            self.s.put(self.mid, 'task_status', {'task': b['id'], 'status': 'DONE', 'evidence': [e['id']]})
        self.evidence(['app.py'])
        (self.root / 'helper.py').write_text('y=2', encoding='utf-8')
        self.assertEqual(self.s.task_status(self.mid, a['id']), 'STALE')
        self.assertEqual(self.s.task_status(self.mid, b['id']), 'STALE')
        self.assertEqual(self.s.gate(self.mid)['status'], 'INCOMPLETE')

    def test_cli_verify_argument_order(self):
        p = self.spec('verify.json', {'requirements': ['R1'], 'verifier': 'test', 'criterion': 'Assertion'})
        r = self.cli('verify', self.mid, '--spec', p, '--command', sys.executable, '-c', 'assert True')
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(json.loads(r.stdout)['result'], 'PASS')

    def test_false_independence_structure_rejected(self):
        with self.assertRaises(ValueError):
            g.verify(self.s, self.mid, {
                'requirements': ['R1'], 'verifier': 'same', 'implementer': 'same',
                'session': 'a', 'independent': True, 'criterion': 'test'
            }, [sys.executable, '-c', 'pass'])

    def test_critical_claim_blocks_until_resolution(self):
        claim = g.register(self.s, self.mid, 'claim', {'text': 'critical behavior', 'critical': True})
        e = self.evidence()
        self.assertEqual(self.s.gate(self.mid)['status'], 'INCOMPLETE')
        r = self.cli('resolve', self.mid, claim['id'], '--evidence', e['id'])
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(self.s.gate(self.mid)['status'], 'COMPLETE')

    def test_budget_and_closed_parent(self):
        with self.s.tx():
            m = self.s.mission(self.mid)
            m['budget']['max_brains'] = 2
            self.s.save_mission(m)
        spec = {'parent': self.mid, 'question': 'Q', 'expected_gain': 'G', 'stop_condition': 'S'}
        r = g.reserve(self.s, self.mid, spec)
        with self.assertRaises(ValueError):
            g.reserve(self.s, self.mid, spec)
        with self.s.tx():
            self.s.put(self.mid, 'release', {'reservation': r['id']})
        with self.assertRaises(ValueError):
            g.reserve(self.s, self.mid, dict(spec, parent=r['id']))
        self.assertIn('id', g.reserve(self.s, self.mid, spec))

    def test_council_round_cap(self):
        with self.s.tx():
            m = self.s.mission(self.mid)
            m['budget']['max_rounds'] = 1
            self.s.save_mission(m)
        p = self.spec('round.json', {'council': 'security', 'question': 'Q', 'expected_gain': 'G'})
        self.assertEqual(self.cli('council-round', self.mid, '--spec', p).returncode, 0)
        self.assertEqual(self.cli('council-round', self.mid, '--spec', p).returncode, 1)

    def test_routing_only_available_and_failed_excluded(self):
        r = g.route(self.s, self.mid, {
            'available_models': ['inherit', 'flash'],
            'preferred_model': 'flash',
            'failed_models': ['flash']
        })
        self.assertEqual(r['model'], 'inherit')
        self.assertEqual(r['mode'], 'SERIAL_LIMITED')

    def test_checkpoint_branch_and_stale(self):
        spec = {k: [] for k in ('known_facts', 'assumptions', 'hypotheses', 'rejected_paths', 'decisions', 'open_questions', 'risks', 'current_plan', 'next_actions')}
        a = g.checkpoint(self.s, self.mid, spec)
        b = g.checkpoint(self.s, self.mid, dict(spec, parent=a['id']))
        self.assertTrue(self.s.fresh(b))
        (self.root / 'app.py').write_text('x=2', encoding='utf-8')
        self.assertFalse(self.s.fresh(b))

    def test_repeated_strategy_blocked(self):
        a = {'strategy': 'edit timeout value', 'error': 'connection timeout'}
        self.assertFalse(g.novelty(self.s, self.mid, a)['blocked'])
        self.assertTrue(g.novelty(self.s, self.mid, a)['blocked'])

    def test_match_dedup_and_cold_start(self):
        e = self.evidence()
        spec = {'id': 'unique', 'evidence': [e['id']], 'pairs': [{'dimension': 'model', 'a': 'flash', 'b': 'pro', 'score_a': 1}]}
        g.match(self.s, self.mid, spec)
        with self.assertRaises(ValueError):
            g.match(self.s, self.mid, spec)
        r = g.route(self.s, self.mid, {'available_models': ['flash', 'pro'], 'preferred_model': 'pro'})
        self.assertEqual(r['model'], 'pro')

    def test_installer_preserves_user_content(self):
        (self.root / 'user.txt').write_text('keep', encoding='utf-8')
        ins.install(self.root, 'modern')
        self.assertTrue(ins.check(self.root)['ok'])
        ins.install(self.root, 'modern')
        self.assertTrue(ins.check(self.root)['ok'])
        rule = self.root / '.agents/rules/gau-v5.md'
        rule.write_text('user edit', encoding='utf-8')
        with self.assertRaises(ValueError):
            ins.install(self.root, 'modern')
        ins.uninstall(self.root)
        self.assertEqual(rule.read_text(encoding='utf-8'), 'user edit')
        self.assertEqual((self.root / 'user.txt').read_text(encoding='utf-8'), 'keep')
        self.assertTrue((self.root / '.gau/state.sqlite3').is_file())

    def test_symlink_storage_rejected(self):
        other = Path(self.tmp.name) / 'other'
        other.mkdir()
        proj = Path(self.tmp.name) / 'linked'
        proj.mkdir()
        try:
            (proj / '.gau').symlink_to(other, target_is_directory=True)
        except (OSError, NotImplementedError):
            self.skipTest('Symlinks unavailable')
        with self.assertRaises(ValueError):
            g.Store(proj)
        self.assertFalse((other / 'state.sqlite3').exists())

    def test_registry_exact_69_and_references(self):
        reg = json.loads((ROOT / 'payload/registry.json').read_text(encoding='utf-8'))['ideas']
        self.assertEqual([r['id'] for r in reg], list(range(1, 70)))
        for r in reg:
            self.assertTrue((ROOT / 'payload/skills' / r['skill'] / 'SKILL.md').is_file())
        for agent in (ROOT / 'payload/agents').glob('*.md'):
            for line in agent.read_text(encoding='utf-8').splitlines():
                if line.startswith('  - skills/'):
                    self.assertTrue((ROOT / 'payload' / line.strip()[2:] / 'SKILL.md').exists())

    def test_timeline_displays_chronological_events_and_tree(self):
        g.register(self.s, self.mid, 'fact', {'text': 'Base fact registered'})
        e = self.evidence()
        r = self.cli('timeline', self.mid)
        self.assertEqual(r.returncode, 0, r.stderr)
        data = json.loads(r.stdout)
        self.assertIn('events', data)
        self.assertIn('tree', data)
        self.assertTrue(len(data['events']) >= 2)
        r_tree = self.cli('timeline', self.mid, '--tree')
        self.assertEqual(r_tree.returncode, 0)
        self.assertIn('Mission:', r_tree.stdout)
        self.assertIn('[FACT]', r_tree.stdout)
        self.assertIn('[EVIDENCE]', r_tree.stdout)

    def test_leaderboard_elo_and_default_provisional_rating(self):
        e = self.evidence()
        spec = {'id': 'match-test-1', 'evidence': [e['id']], 'pairs': [{'dimension': 'agent', 'a': 'gau-implementer', 'b': 'baseline-agent', 'score_a': 1.0}]}
        g.match(self.s, self.mid, spec)
        r = self.cli('leaderboard')
        self.assertEqual(r.returncode, 0, r.stderr)
        data = json.loads(r.stdout)
        agents = {a['entity']: a for a in data['agents']}
        self.assertIn('gau-implementer', agents)
        self.assertEqual(agents['gau-implementer']['rating'], 1500.0)
        self.assertEqual(agents['gau-implementer']['wins'], 1)
        self.assertEqual(agents['gau-implementer']['status'], 'PROVISIONAL')
        r_tbl = self.cli('leaderboard', '--table')
        self.assertEqual(r_tbl.returncode, 0)
        self.assertIn('GAU v5 ELO LEADERBOARD', r_tbl.stdout)
        self.assertIn('gau-implementer', r_tbl.stdout)

    def test_close_records_autonomous_post_mortem_lesson(self):
        self.evidence()
        r = self.cli('close', self.mid)
        self.assertEqual(r.returncode, 0, r.stderr)
        lessons = self.s.items(self.mid, 'lesson')
        self.assertTrue(len(lessons) >= 1)
        pm = lessons[-1]
        self.assertTrue(pm.get('autonomous'))
        self.assertTrue(pm.get('post_mortem'))
        self.assertIn('R1', pm.get('fulfilled_requirements', []))
        self.assertIn('Post-Mortem Autônomo', pm.get('text', ''))

    def test_runtime_files_parity_sha256(self):
        h1 = hashlib.sha256((ROOT.parent / '.gau/runtime/gau.py').read_bytes()).hexdigest()
        h2 = hashlib.sha256((ROOT / 'payload/runtime/gau.py').read_bytes()).hexdigest()
        self.assertEqual(h1, h2, "Both runtime gau.py files must have identical sha256")

    def test_string_input_normalization(self):
        # available_models as string in route
        r = g.route(self.s, self.mid, {'available_models': 'inherit'})
        self.assertEqual(r['model'], 'inherit')
        self.assertEqual(r['status'], 'READY')

        # files as string in evidence/verify
        ev = self.evidence(files='app.py')
        self.assertEqual(ev['result'], 'PASS')
        self.assertIn('app.py', ev['snapshot']['hashes'])

        # dependencies as string in task_add
        t1 = g.task_add(self.s, self.mid, {'text': 'Task 1', 'owner': 'worker'})
        t2 = g.task_add(self.s, self.mid, {'text': 'Task 2', 'owner': 'worker', 'dependencies': t1['id']})
        self.assertEqual(t2['dependencies'], [t1['id']])

        # evidence as string in register
        fact = g.register(self.s, self.mid, 'fact', {'text': 'Fact with single evidence', 'evidence': ev['id']})
        self.assertEqual(fact['evidence'], [ev['id']])

    def test_evidence_custom_levels_e0_to_e5(self):
        m3 = g.new_mission(self.s, {
            'goal': 'High level goal',
            'requirements': [{'id': 'REQ-E3', 'text': 'Level 3 required', 'min_level': 3}]
        })
        m3_id = m3['id']
        spec = {'requirements': ['REQ-E3'], 'verifier': 'auditor', 'criterion': 'Hard test', 'level': 3}
        ev3 = g.verify(self.s, m3_id, spec, [sys.executable, '-c', 'pass'])
        self.assertEqual(ev3['level'], 3)
        self.assertEqual(self.s.gate(m3_id)['status'], 'COMPLETE')

        # Invalid level > 5 must fail
        with self.assertRaises(ValueError):
            g.verify(self.s, m3_id, dict(spec, level=6), [sys.executable, '-c', 'pass'])

    def test_task_status_cli_command(self):
        task = g.task_add(self.s, self.mid, {'text': 'Build something', 'owner': 'worker'})
        r = self.cli('task-status', self.mid, task['id'])
        self.assertEqual(r.returncode, 0, r.stderr)
        data = json.loads(r.stdout)
        self.assertEqual(data['mission'], self.mid)
        self.assertEqual(data['task'], task['id'])
        self.assertEqual(data['status'], 'PENDING')

    def test_checkpoint_reopen_required_blocks_gate(self):
        self.evidence()
        self.assertEqual(self.s.gate(self.mid)['status'], 'COMPLETE')
        spec = {k: [] for k in ('known_facts', 'assumptions', 'hypotheses', 'rejected_paths', 'decisions', 'open_questions', 'risks', 'current_plan', 'next_actions')}
        cp = g.checkpoint(self.s, self.mid, spec)
        r = self.cli('restore-checkpoint', self.mid, cp['id'])
        self.assertEqual(r.returncode, 0, r.stderr)
        m = self.s.mission(self.mid)
        self.assertEqual(m['status'], 'REOPEN_REQUIRED')
        gate = self.s.gate(self.mid)
        self.assertEqual(gate['status'], 'INCOMPLETE')
        self.assertTrue(any((b.get('type') == 'status' if isinstance(b, dict) else 'reabertura' in str(b)) for b in gate['blockers']))
        # Reopen restores ACTIVE status
        r_reopen = self.cli('reopen', self.mid)
        self.assertEqual(r_reopen.returncode, 0, r_reopen.stderr)
        self.assertEqual(self.s.mission(self.mid)['status'], 'ACTIVE')
        self.assertEqual(self.s.gate(self.mid)['status'], 'COMPLETE')

    def test_critical_failure_blocks_gate(self):
        e = self.evidence()
        self.assertEqual(self.s.gate(self.mid)['status'], 'COMPLETE')
        fail_item = g.register(self.s, self.mid, 'failure', {'text': 'Critical flaw detected', 'critical': True})
        gate = self.s.gate(self.mid)
        self.assertEqual(gate['status'], 'INCOMPLETE')
        self.assertTrue(any(fail_item['id'] in str(b) for b in gate['blockers']))
        # Resolve the failure with valid PASS evidence
        r = self.cli('resolve', self.mid, fail_item['id'], '--evidence', e['id'])
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(self.s.gate(self.mid)['status'], 'COMPLETE')

    def test_leaderboard_all_dimensions(self):
        e = self.evidence()
        spec = {
            'id': 'match-multi-dim',
            'evidence': [e['id']],
            'pairs': [
                {'dimension': 'tool', 'a': 'ripgrep', 'b': 'fd', 'score_a': 1.0},
                {'dimension': 'pipeline', 'a': 'pipe-fast', 'b': 'pipe-safe', 'score_a': 0.5},
                {'dimension': 'combination', 'a': 'combo-alpha', 'b': 'combo-beta', 'score_a': 1.0}
            ]
        }
        g.match(self.s, self.mid, spec)
        r = self.cli('leaderboard')
        self.assertEqual(r.returncode, 0, r.stderr)
        data = json.loads(r.stdout)
        self.assertIn('tools', data)
        self.assertIn('pipelines', data)
        self.assertIn('combinations', data)
        self.assertTrue(any(t['entity'] == 'ripgrep' for t in data['tools']))
        # Test CLI filtering by dimension
        r_tool = self.cli('leaderboard', '--dimension', 'tool')
        self.assertEqual(r_tool.returncode, 0, r_tool.stderr)

    def test_store_context_manager(self):
        with g.Store(self.root) as store:
            self.assertTrue(store.root.is_dir())
            m = g.new_mission(store, {'goal': 'Context manager test', 'requirements': [{'id': 'RCM', 'text': 'Test'}]})
            self.assertIn('id', m)
        # Verify db is closed
        with self.assertRaises(sqlite3.ProgrammingError):
            store.db.execute('SELECT 1')

    def test_timeline_includes_lifecycle_events(self):
        spec = {k: [] for k in ('known_facts', 'assumptions', 'hypotheses', 'rejected_paths', 'decisions', 'open_questions', 'risks', 'current_plan', 'next_actions')}
        cp = g.checkpoint(self.s, self.mid, spec)
        self.cli('restore-checkpoint', self.mid, cp['id'])
        r = self.cli('timeline', self.mid)
        self.assertEqual(r.returncode, 0, r.stderr)
        data = json.loads(r.stdout)
        event_kinds = [e.get('kind') for e in data['events']]
        self.assertIn('checkpoint-selected', event_kinds)
        r_tree = self.cli('timeline', self.mid, '--tree')
        self.assertEqual(r_tree.returncode, 0)
        self.assertIn('CHECKPOINT-SELECTED', r_tree.stdout)

    def test_hypotheses_evidence_string_no_silent_decay(self):
        e = self.evidence()
        hyp = g.register(self.s, self.mid, 'hypothesis', {
            'text': 'Hypothesis with string evidence',
            'discriminating_test': 'Run test',
            'confidence': 0.8,
            'evidence': e['id']
        })
        hyps = g.get_hypotheses(self.s, self.mid)
        matched = [h for h in hyps if h['id'] == hyp['id']]
        self.assertEqual(len(matched), 1)
        # Priority should not decay because evidence is valid
        self.assertAlmostEqual(matched[0]['priority'], 0.8, places=3)

    def test_mission_closed_immutability(self):
        self.evidence()
        r = self.cli('close', self.mid)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(self.s.mission(self.mid)['status'], 'COMPLETE')
        with self.assertRaises(ValueError):
            g.register(self.s, self.mid, 'fact', {'text': 'New fact after close'})
        with self.assertRaises(ValueError):
            self.evidence()
        with self.assertRaises(ValueError):
            g.task_add(self.s, self.mid, {'text': 'Task after close', 'owner': 'worker'})
        # Reopening allows actions again
        self.cli('reopen', self.mid)
        self.assertEqual(self.s.mission(self.mid)['status'], 'ACTIVE')
        f = g.register(self.s, self.mid, 'fact', {'text': 'Fact after reopen'})
        self.assertIn('id', f)

    def test_string_dependencies_task_done_and_ready(self):
        e = self.evidence()
        t1 = g.task_add(self.s, self.mid, {'text': 'Task 1', 'owner': 'worker'})
        t2 = g.task_add(self.s, self.mid, {'text': 'Task 2', 'owner': 'worker', 'dependencies': t1['id']})
        # CLI ready should include t1, but not t2 yet
        r_ready = self.cli('ready', self.mid)
        self.assertEqual(r_ready.returncode, 0, r_ready.stderr)
        ready_ids = [t['id'] for t in json.loads(r_ready.stdout)]
        self.assertIn(t1['id'], ready_ids)
        self.assertNotIn(t2['id'], ready_ids)

        # Completing t1 enables t2
        r_done1 = self.cli('task-done', self.mid, t1['id'], '--evidence', e['id'])
        self.assertEqual(r_done1.returncode, 0, r_done1.stderr)

        r_ready2 = self.cli('ready', self.mid)
        self.assertEqual(r_ready2.returncode, 0, r_ready2.stderr)
        ready_ids2 = [t['id'] for t in json.loads(r_ready2.stdout)]
        self.assertIn(t2['id'], ready_ids2)

        # Completing t2 succeeds
        r_done2 = self.cli('task-done', self.mid, t2['id'], '--evidence', e['id'])
        self.assertEqual(r_done2.returncode, 0, r_done2.stderr)
        self.assertEqual(self.s.task_status(self.mid, t2['id']), 'DONE')

    def test_gate_resolves_and_no_substring_collision(self):
        f1 = g.register(self.s, self.mid, 'failure', {'text': 'Short ID fail', 'critical': True})
        f10 = g.register(self.s, self.mid, 'failure', {'text': 'Long ID fail', 'critical': True})
        self.evidence()

        # Gate must be blocked by both
        gate = self.s.gate(self.mid)
        self.assertEqual(gate['status'], 'INCOMPLETE')
        self.assertTrue(any(f1['id'] in str(b) for b in gate['blockers']))
        self.assertTrue(any(f10['id'] in str(b) for b in gate['blockers']))

        # Resolving f10 should NOT resolve f1 even if f1['id'] is prefix of f10['id']
        ev10 = g.verify(self.s, self.mid, {
            'requirements': ['R1'], 'verifier': 'v', 'criterion': 'Fix 10',
            'resolves': [f10['id']]
        }, [sys.executable, '-c', 'pass'])
        gate = self.s.gate(self.mid)
        self.assertTrue(any(f1['id'] in str(b) for b in gate['blockers']), "f1 must not be resolved by substring match")

        # Resolving f1 specifically resolves it
        ev1 = g.verify(self.s, self.mid, {
            'requirements': ['R1'], 'verifier': 'v', 'criterion': 'Fix 1',
            'resolves': f1['id']  # Pass as string to verify string normalization in resolves
        }, [sys.executable, '-c', 'pass'])
        gate = self.s.gate(self.mid)
        self.assertEqual(gate['status'], 'COMPLETE')

    def test_config_json_budget_and_routing_defaults(self):
        # Write custom config into root/.gau/config.json
        cfg_path = self.root / '.gau' / 'config.json'
        cfg_path.write_text(json.dumps({
            'default_max_brains': 12,
            'max_rounds': 5,
            'routing_min_samples': 2
        }), encoding='utf-8')
        with g.Store(self.root) as s2:
            m = g.new_mission(s2, {'goal': 'Config test', 'requirements': [{'id': 'RC', 'text': 'Req'}]})
            self.assertEqual(m['budget']['max_brains'], 12)
            self.assertEqual(m['budget']['max_rounds'], 5)

    def test_python_api_attest_and_resolve_and_task_done(self):
        # Test attest
        dummy_art = self.root / 'artifact.txt'
        dummy_art.write_text('audit passed', encoding='utf-8')
        att = g.attest(self.s, self.mid, {
            'requirements': ['R1'],
            'verifier': 'auditor',
            'criterion': 'Manual inspection',
            'result': 'PASS',
            'artifact': 'artifact.txt'
        })
        self.assertEqual(att['result'], 'PASS')
        self.assertEqual(att['provenance'], 'agent-attestation')

        # Test resolve via python API
        fail_item = g.register(self.s, self.mid, 'failure', {'text': 'API failure', 'critical': True})
        res = g.resolve(self.s, self.mid, fail_item['id'], att['id'])
        self.assertEqual(res['target'], fail_item['id'])

        # Test task_done via python API
        task = g.task_add(self.s, self.mid, {'text': 'API task', 'owner': 'worker'})
        td = g.task_done(self.s, self.mid, task['id'], att['id'])
        self.assertEqual(td['status'], 'DONE')

if __name__ == '__main__':
    unittest.main()
