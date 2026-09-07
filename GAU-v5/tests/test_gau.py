import contextlib
import importlib.util
import io
import json
from pathlib import Path
import sqlite3
import subprocess
import sys
import tempfile
import unittest
ROOT=Path(__file__).resolve().parents[1]
def module(name,path):
    spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
g=module('gau',ROOT/'payload/runtime/gau.py');ins=module('installer',ROOT/'install.py')

class IntegrationTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name)/'project';self.root.mkdir()
        (self.root/'app.py').write_text('x=1\n');(self.root/'helper.py').write_text('y=1\n')
        self.s=g.Store(self.root)
        self.mid=g.new_mission(self.s,{'goal':'Fix behavior','risk':'high','requirements':[{'id':'R1','text':'Behavior works'}]})['id']
    def tearDown(self): self.s.close();self.tmp.cleanup()
    def evidence(self,files=None):
        spec={'requirements':['R1'],'verifier':'worker','criterion':'Real successful process'}
        if files is not None:spec['files']=files
        return g.verify(self.s,self.mid,spec,[sys.executable,'-c','assert 1+1==2'])
    def cli(self,*args):
        return subprocess.run([sys.executable,str(ROOT/'payload/runtime/gau.py'),'--project',str(self.root),*args],capture_output=True,text=True)
    def spec(self,name,data):
        p=self.root/'.gau'/name;p.write_text(json.dumps(data));return str(p)
    def test_missing_proof_then_pass_then_stale(self):
        self.assertEqual(self.s.gate(self.mid)['status'],'INCOMPLETE')
        self.evidence();self.assertEqual(self.s.gate(self.mid)['status'],'COMPLETE')
        (self.root/'new.py').write_text('new=True')
        self.assertEqual(self.s.gate(self.mid)['status'],'INCOMPLETE')
    def test_log_tamper_invalidates_proof(self):
        e=self.evidence();(self.root/e['log']).write_text('tampered')
        self.assertFalse(self.s.fresh(e))
    def test_failure_requires_explicit_resolution(self):
        spec={'requirements':['R1'],'verifier':'worker','criterion':'process'}
        bad=g.verify(self.s,self.mid,spec,[sys.executable,'-c','raise SystemExit(1)'])
        self.evidence();self.assertEqual(self.s.gate(self.mid)['status'],'INCOMPLETE')
        g.verify(self.s,self.mid,dict(spec,resolves=[bad['id']]),[sys.executable,'-c','pass'])
        self.assertEqual(self.s.gate(self.mid)['status'],'COMPLETE')
    def test_task_evidence_and_dependencies_revalidate(self):
        a=g.task_add(self.s,self.mid,{'text':'A','owner':'worker'})
        b=g.task_add(self.s,self.mid,{'text':'B','owner':'worker','dependencies':[a['id']]})
        e=self.evidence()
        with self.s.tx():
            self.s.put(self.mid,'task_status',{'task':a['id'],'status':'DONE','evidence':[e['id']]})
            self.s.put(self.mid,'task_status',{'task':b['id'],'status':'DONE','evidence':[e['id']]})
        self.evidence(['app.py'])
        (self.root/'helper.py').write_text('y=2')
        self.assertEqual(self.s.task_status(self.mid,a['id']),'STALE')
        self.assertEqual(self.s.task_status(self.mid,b['id']),'STALE')
        self.assertEqual(self.s.gate(self.mid)['status'],'INCOMPLETE')
    def test_cli_verify_argument_order(self):
        p=self.spec('verify.json',{'requirements':['R1'],'verifier':'test','criterion':'Assertion'})
        r=self.cli('verify',self.mid,'--spec',p,'--command',sys.executable,'-c','assert True')
        self.assertEqual(r.returncode,0,r.stderr);self.assertEqual(json.loads(r.stdout)['result'],'PASS')
    def test_false_independence_structure_rejected(self):
        with self.assertRaises(ValueError):
            g.verify(self.s,self.mid,{'requirements':['R1'],'verifier':'same','implementer':'same','session':'a','independent':True,'criterion':'test'},[sys.executable,'-c','pass'])
    def test_critical_claim_blocks_until_resolution(self):
        claim=g.register(self.s,self.mid,'claim',{'text':'critical behavior','critical':True})
        e=self.evidence();self.assertEqual(self.s.gate(self.mid)['status'],'INCOMPLETE')
        r=self.cli('resolve',self.mid,claim['id'],'--evidence',e['id'])
        self.assertEqual(r.returncode,0,r.stderr);self.assertEqual(self.s.gate(self.mid)['status'],'COMPLETE')
    def test_budget_and_closed_parent(self):
        with self.s.tx():
            m=self.s.mission(self.mid);m['budget']['max_brains']=2;self.s.save_mission(m)
        spec={'parent':self.mid,'question':'Q','expected_gain':'G','stop_condition':'S'}
        r=g.reserve(self.s,self.mid,spec)
        with self.assertRaises(ValueError):g.reserve(self.s,self.mid,spec)
        with self.s.tx():self.s.put(self.mid,'release',{'reservation':r['id']})
        with self.assertRaises(ValueError):g.reserve(self.s,self.mid,dict(spec,parent=r['id']))
        self.assertIn('id',g.reserve(self.s,self.mid,spec))
    def test_council_round_cap(self):
        with self.s.tx():
            m=self.s.mission(self.mid);m['budget']['max_rounds']=1;self.s.save_mission(m)
        p=self.spec('round.json',{'council':'security','question':'Q','expected_gain':'G'})
        self.assertEqual(self.cli('council-round',self.mid,'--spec',p).returncode,0)
        self.assertEqual(self.cli('council-round',self.mid,'--spec',p).returncode,1)
    def test_routing_only_available_and_failed_excluded(self):
        r=g.route(self.s,self.mid,{'available_models':['inherit','flash'],'preferred_model':'flash','failed_models':['flash']})
        self.assertEqual(r['model'],'inherit');self.assertEqual(r['mode'],'SERIAL_LIMITED')
    def test_checkpoint_branch_and_stale(self):
        spec={k:[] for k in ('known_facts','assumptions','hypotheses','rejected_paths','decisions','open_questions','risks','current_plan','next_actions')}
        a=g.checkpoint(self.s,self.mid,spec);b=g.checkpoint(self.s,self.mid,dict(spec,parent=a['id']))
        self.assertTrue(self.s.fresh(b));(self.root/'app.py').write_text('x=2')
        self.assertFalse(self.s.fresh(b))
    def test_repeated_strategy_blocked(self):
        a={'strategy':'edit timeout value','error':'connection timeout'}
        self.assertFalse(g.novelty(self.s,self.mid,a)['blocked'])
        self.assertTrue(g.novelty(self.s,self.mid,a)['blocked'])
    def test_match_dedup_and_cold_start(self):
        e=self.evidence();spec={'id':'unique','evidence':[e['id']],'pairs':[{'dimension':'model','a':'flash','b':'pro','score_a':1}]}
        g.match(self.s,self.mid,spec)
        with self.assertRaises(ValueError):g.match(self.s,self.mid,spec)
        r=g.route(self.s,self.mid,{'available_models':['flash','pro'],'preferred_model':'pro'})
        self.assertEqual(r['model'],'pro')
    def test_installer_preserves_user_content(self):
        (self.root/'user.txt').write_text('keep')
        ins.install(self.root,'modern');self.assertTrue(ins.check(self.root)['ok'])
        ins.install(self.root,'modern');self.assertTrue(ins.check(self.root)['ok'])
        rule=self.root/'.agents/rules/gau-v5.md';rule.write_text('user edit')
        with self.assertRaises(ValueError):ins.install(self.root,'modern')
        ins.uninstall(self.root)
        self.assertEqual(rule.read_text(),'user edit');self.assertEqual((self.root/'user.txt').read_text(),'keep')
        self.assertTrue((self.root/'.gau/state.sqlite3').is_file())
    def test_symlink_storage_rejected(self):
        other=Path(self.tmp.name)/'other';other.mkdir();proj=Path(self.tmp.name)/'linked';proj.mkdir()
        try:(proj/'.gau').symlink_to(other,target_is_directory=True)
        except (OSError,NotImplementedError):self.skipTest('Symlinks unavailable')
        with self.assertRaises(ValueError):g.Store(proj)
        self.assertFalse((other/'state.sqlite3').exists())
    def test_registry_exact_69_and_references(self):
        reg=json.loads((ROOT/'payload/registry.json').read_text())['ideas']
        self.assertEqual([r['id'] for r in reg],list(range(1,70)))
        for r in reg:self.assertTrue((ROOT/'payload/skills'/r['skill']/'SKILL.md').is_file())
        for agent in (ROOT/'payload/agents').glob('*.md'):
            for line in agent.read_text().splitlines():
                if line.startswith('  - skills/'):
                    self.assertTrue((ROOT/'payload'/line.strip()[2:] / 'SKILL.md').exists())
    def test_timeline_displays_chronological_events_and_tree(self):
        g.register(self.s,self.mid,'fact',{'text':'Base fact registered'})
        e=self.evidence()
        r=self.cli('timeline',self.mid)
        self.assertEqual(r.returncode,0,r.stderr)
        data=json.loads(r.stdout)
        self.assertIn('events',data)
        self.assertIn('tree',data)
        self.assertTrue(len(data['events'])>=2)
        r_tree=self.cli('timeline',self.mid,'--tree')
        self.assertEqual(r_tree.returncode,0)
        self.assertIn('Mission:',r_tree.stdout)
        self.assertIn('[FACT]',r_tree.stdout)
        self.assertIn('[EVIDENCE]',r_tree.stdout)
    def test_leaderboard_elo_and_default_provisional_rating(self):
        e=self.evidence()
        spec={'id':'match-test-1','evidence':[e['id']],'pairs':[{'dimension':'agent','a':'gau-implementer','b':'baseline-agent','score_a':1.0}]}
        g.match(self.s,self.mid,spec)
        r=self.cli('leaderboard')
        self.assertEqual(r.returncode,0,r.stderr)
        data=json.loads(r.stdout)
        agents={a['entity']:a for a in data['agents']}
        self.assertIn('gau-implementer',agents)
        self.assertEqual(agents['gau-implementer']['rating'],1500.0)
        self.assertEqual(agents['gau-implementer']['wins'],1)
        self.assertEqual(agents['gau-implementer']['status'],'PROVISIONAL')
        r_tbl=self.cli('leaderboard','--table')
        self.assertEqual(r_tbl.returncode,0)
        self.assertIn('GAU v5 ELO LEADERBOARD',r_tbl.stdout)
        self.assertIn('gau-implementer',r_tbl.stdout)
    def test_close_records_autonomous_post_mortem_lesson(self):
        self.evidence()
        r=self.cli('close',self.mid)
        self.assertEqual(r.returncode,0,r.stderr)
        lessons=self.s.items(self.mid,'lesson')
        self.assertTrue(len(lessons)>=1)
        pm=lessons[-1]
        self.assertTrue(pm.get('autonomous'))
        self.assertTrue(pm.get('post_mortem'))
        self.assertIn('R1',pm.get('fulfilled_requirements',[]))
        self.assertIn('Post-Mortem Autônomo',pm.get('text',''))

if __name__=='__main__':unittest.main()
