#!/usr/bin/env python3
"""GAU v5: local mission state and verifiable agent orchestration support.

No model API calls: native Antigravity owns execution, permissions and billing.
"""
from __future__ import annotations
import argparse
import contextlib
import datetime as dt
import hashlib
import json
import math
import os
from pathlib import Path
import re
import sqlite3
import subprocess
import sys
import time
import uuid

VERSION = '5.0.0'
SKIP = {'.git', '.gau', '.agents', '.agent', 'node_modules', '.venv', 'venv',
        '__pycache__', '.pytest_cache', 'dist', 'build', '.next', 'coverage'}
KINDS = {'fact', 'hypothesis', 'decision', 'contradiction', 'failure', 'lesson',
         'assumption', 'risk', 'finding', 'claim', 'knowledge', 'council', 'pipeline'}
def dumps(value): return json.dumps(value, ensure_ascii=False, indent=2)
def now(): return dt.datetime.now(dt.timezone.utc).isoformat()
def sha(data): return hashlib.sha256(data).hexdigest()
def ident(prefix): return prefix + '-' + uuid.uuid4().hex[:12]
def load_file(path): return json.loads(Path(path).read_text(encoding='utf-8-sig'))
def fail(message): raise ValueError(message)

class Store:
    def __init__(self, project):
        self.root = Path(project).resolve()
        if not self.root.is_dir(): fail('Projeto inexistente.')
        self.base = self.path('.gau')
        self.base.mkdir(exist_ok=True)
        for name in ('state.sqlite3','state.sqlite3-wal','state.sqlite3-shm'):
            self.path('.gau/'+name)
        self.db = sqlite3.connect(self.path('.gau/state.sqlite3'), timeout=30)
        self.db.row_factory = sqlite3.Row
        self.db.execute('PRAGMA journal_mode=WAL')
        self.db.executescript('''
        CREATE TABLE IF NOT EXISTS missions(id TEXT PRIMARY KEY, data TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS items(id TEXT PRIMARY KEY, mission TEXT NOT NULL,
          kind TEXT NOT NULL, data TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS events(seq INTEGER PRIMARY KEY AUTOINCREMENT,
          mission TEXT, timestamp TEXT NOT NULL, kind TEXT NOT NULL, data TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS ratings(domain TEXT, dimension TEXT, entity TEXT,
          rating REAL NOT NULL, samples INTEGER NOT NULL, updated REAL NOT NULL,
          PRIMARY KEY(domain,dimension,entity));
        CREATE TABLE IF NOT EXISTS outcomes(id TEXT PRIMARY KEY, data TEXT NOT NULL);
        ''')
        self.db.commit()
    def close(self): self.db.close()
    @contextlib.contextmanager
    def tx(self):
        self.db.execute('BEGIN IMMEDIATE')
        try:
            yield
            self.db.commit()
        except BaseException:
            self.db.rollback()
            raise
    def path(self, rel):
        p = self.root / rel
        if Path(rel).is_absolute() or '..' in Path(rel).parts:
            fail('Use caminhos relativos dentro do projeto.')
        # Symlinks are not followed for evidence or mutations.
        for a in [p, *p.parents]:
            if a == self.root: break
            if a.is_symlink(): fail('Link simbólico não permitido: ' + str(rel))
        p = p.resolve()
        if not p.is_relative_to(self.root): fail('Caminho fora do projeto.')
        return p
    def snapshot(self, files=None):
        if files is not None:
            return {f: sha(self.path(f).read_bytes()) if self.path(f).is_file() else None
                    for f in sorted(set(files))}
        output = {}
        for parent, dirs, names in os.walk(self.root, followlinks=False):
            dirs[:] = sorted(d for d in dirs if d not in SKIP and
                             not (Path(parent)/d).is_symlink())
            for name in sorted(names):
                p = Path(parent)/name
                if p.is_symlink(): continue
                # Secret-bearing file content is never included in logs, only hashes.
                if p.is_file(): output[p.relative_to(self.root).as_posix()] = sha(p.read_bytes())
        return output
    def snapshot_record(self, files=None):
        return {'scope': 'project' if files is None else 'files', 'hashes': self.snapshot(files),
                'excluded_directories': sorted(SKIP) if files is None else []}
    def fresh(self, evidence):
        snap = evidence.get('snapshot')
        if not snap: return False
        for field in ('artifact','log'):
            if evidence.get(field):
                p=self.path(evidence[field])
                if not p.is_file() or sha(p.read_bytes())!=evidence.get(field+'_hash'): return False
        return self.snapshot(None if snap['scope']=='project' else list(snap['hashes'])) == snap['hashes']
    def mission(self, mid):
        row = self.db.execute('SELECT data FROM missions WHERE id=?', (mid,)).fetchone()
        if not row: fail('Missão desconhecida: ' + mid)
        return json.loads(row['data'])
    def save_mission(self, m):
        self.db.execute('INSERT OR REPLACE INTO missions VALUES (?,?)', (m['id'], dumps(m)))
    def event(self, mid, kind, data):
        self.db.execute('INSERT INTO events(mission,timestamp,kind,data) VALUES (?,?,?,?)',
                        (mid, now(), kind, dumps(data)))
    def item(self, iid):
        row = self.db.execute('SELECT data FROM items WHERE id=?', (iid,)).fetchone()
        if not row: fail('Registro desconhecido: ' + iid)
        return json.loads(row['data'])
    def put(self, mid, kind, data):
        iid = ident(kind)
        data = dict(data, id=iid, mission=mid, kind=kind, timestamp=now())
        self.db.execute('INSERT INTO items VALUES (?,?,?,?)', (iid,mid,kind,dumps(data)))
        return data
    def items(self, mid, kind=None):
        q, args = 'SELECT data FROM items WHERE mission=?', [mid]
        if kind: q += ' AND kind=?'; args.append(kind)
        return [json.loads(x['data']) for x in self.db.execute(q,args)]
    def check_evidence(self, mid, ids):
        for iid in ids:
            e = self.item(iid)
            if e['mission'] != mid or e['kind'] != 'evidence': fail('Evidência de outra missão ou tipo.')
            if e['result'] != 'PASS' or not self.fresh(e): fail('Evidência inválida ou obsoleta: '+iid)
    def gate(self, mid):
        m = self.mission(mid)
        blocks = []
        rows = []
        if not m['requirements']: blocks.append('Nenhum requisito registrado.')
        for req in m['requirements']:
            candidates = [e for e in self.items(mid,'evidence') if req['id'] in e.get('requirements',[])]
            fresh = [e for e in candidates if self.fresh(e)]
            passes = [e for e in fresh if e['result']=='PASS' and e['level']>=req['min_level']
                      and (not req['independent'] or e['independent'])]
            # A later pass does not silently erase an unresolved failing observation.
            covered_failures = {fid for e in passes for fid in e.get('resolves',[])}
            failures = [e['id'] for e in fresh if e['result']=='FAIL' and e['id'] not in covered_failures]
            ok = bool(passes) and not failures
            if not ok: blocks.append('Requisito sem prova válida: '+req['id'])
            rows.append({'requirement':req['id'],'passed':ok,'evidence':[e['id'] for e in passes],
                         'unresolved_failures':failures})
        for kind in ('finding','contradiction','risk','claim'):
            for item in self.items(mid,kind):
                if item.get('critical') or item.get('severity') in ('HIGH','CRITICAL'):
                    resolutions = [r for r in self.items(mid,'resolution') if r['target']==item['id']]
                    valid = False
                    for r in resolutions:
                        try: self.check_evidence(mid,r['evidence']); valid=True
                        except ValueError: pass
                    if not valid: blocks.append('Pendência crítica: '+item['id'])
        open_tasks = [t['id'] for t in self.items(mid,'task') if self.task_status(mid,t['id']) != 'DONE']
        if open_tasks: blocks.append('Tarefas abertas: '+', '.join(open_tasks))
        proof = {'mission':mid,'status':'COMPLETE' if not blocks else 'INCOMPLETE',
                 'requirements':rows,'blockers':blocks,'timestamp':now(),
                 'limits':'PASS comprova execução/atestado registrado; o agente deve avaliar se o teste cobre o requisito.'}
        return proof
    def task_status(self, mid, tid):
        updates=[x for x in self.items(mid,'task_status') if x['task']==tid]
        if not updates: return 'PENDING'
        update=updates[-1]
        if update['status']!='DONE': return update['status']
        try: self.check_evidence(mid,update['evidence'])
        except ValueError: return 'STALE'
        task=self.item(tid)
        if any(self.task_status(mid,d)!='DONE' for d in task['dependencies']): return 'STALE'
        return 'DONE'

def new_mission(s, spec):
    goal = spec.get('goal','').strip()
    if not goal: fail('goal obrigatório.')
    requirements = spec.get('requirements',[])
    seen = set()
    for r in requirements:
        if not r.get('id') or r['id'] in seen or not r.get('text'): fail('Requisito sem ID/texto ou duplicado.')
        seen.add(r['id'])
        r.setdefault('min_level',2); r.setdefault('independent',False)
        if r['min_level'] not in range(6): fail('min_level deve ser 0..5.')
    mid = ident('mission')
    m = {'id':mid,'goal':goal,'requirements':requirements,'domain':spec.get('domain','general'),
         'risk':spec.get('risk','medium'),'created':now(),'status':'ACTIVE',
         'budget':dict({'max_brains':8,'max_depth':2,'max_children':6,'max_rounds':3,
                        'max_seconds':7200,'max_tool_calls':500,'max_tokens':250000},**spec.get('budget',{}))}
    if m['risk'] not in ('low','medium','high','critical'): fail('Risco inválido.')
    for key,value in m['budget'].items():
        if not isinstance(value,int) or value<1: fail('Orçamento inválido: '+key)
    with s.tx(): s.save_mission(m); s.event(mid,'created',m)
    return m

def register(s,mid,kind,data):
    s.mission(mid)
    if kind not in KINDS: fail('Tipo inválido.')
    if not data.get('text'): fail('text obrigatório.')
    if data.get('evidence'): s.check_evidence(mid,data['evidence'])
    if 'files' in data: data['snapshot']=s.snapshot_record(data['files'])
    if kind=='hypothesis':
        if not data.get('discriminating_test'): fail('Hipótese precisa de discriminating_test.')
        data.setdefault('confidence',0.5)
        if not 0<=data['confidence']<=1: fail('Confiança deve estar entre 0 e 1.')
    with s.tx(): return s.put(mid,kind,data)

def verify(s,mid,spec,command=None,timeout=300):
    m=s.mission(mid)
    reqs = spec.get('requirements',[])
    known={x['id'] for x in m['requirements']}
    if not reqs or not set(reqs)<=known: fail('Indique requisitos válidos.')
    if not spec.get('verifier') or not spec.get('criterion'): fail('verifier e criterion obrigatórios.')
    independent=bool(spec.get('independent',False))
    if independent and (not spec.get('implementer') or not spec.get('session') or
                        spec['verifier']==spec['implementer']):
        fail('Verificação independente exige implementer diferente e ID da sessão real.')
    resolves=spec.get('resolves',[])
    for fid in resolves:
        old=s.item(fid)
        if old['mission']!=mid or old['kind']!='evidence' or old['result']!='FAIL':
            fail('resolves deve referenciar falhas desta missão.')
    snap=s.snapshot_record(spec.get('files'))
    evidence=dict(spec,snapshot=snap, independent=independent, resolves=resolves)
    if command:
        start=time.monotonic()
        logdir=s.path('.gau/logs'); logdir.mkdir(exist_ok=True)
        logfile=logdir/(ident('run')+'.log')
        timed_out=False
        # No shell parsing. Windows .cmd launch requires an explicit cmd /c from the caller.
        with logfile.open('wb') as out:
            proc=subprocess.Popen(command,cwd=s.root,stdout=out,stderr=subprocess.STDOUT)
            try: code=proc.wait(timeout=timeout)
            except subprocess.TimeoutExpired:
                proc.kill(); proc.wait(); code=-1; timed_out=True
        unchanged=s.fresh({'snapshot':snap})
        evidence.update(command=command,exit_code=code,seconds=time.monotonic()-start,
                        log=logfile.relative_to(s.root).as_posix(),log_hash=sha(logfile.read_bytes()),
                        result='PASS' if code==0 and unchanged and not timed_out else 'FAIL',
                        level=2, snapshot_unchanged=unchanged, timed_out=timed_out,
                        provenance='executed-command')
    else:
        if spec.get('result') not in ('PASS','FAIL'): fail('Atestado exige result PASS/FAIL.')
        if not spec.get('artifact'): fail('Atestado exige artifact local verificável.')
        artifact=s.path(spec['artifact'])
        if not artifact.is_file(): fail('Artefato ausente.')
        evidence.update(level=2,provenance='agent-attestation',artifact_hash=sha(artifact.read_bytes()))
    with s.tx():
        e=s.put(mid,'evidence',evidence); s.event(mid,'verification',{'id':e['id'],'result':e['result']})
    return e

def checkpoint(s,mid,spec):
    m=s.mission(mid)
    required={'known_facts','assumptions','hypotheses','rejected_paths','decisions','open_questions',
              'risks','current_plan','next_actions'}
    if not required<=spec.keys(): fail('Checkpoint incompleto: '+', '.join(sorted(required-spec.keys())))
    if spec.get('parent'):
        parent=s.item(spec['parent'])
        if parent['mission']!=mid or parent['kind']!='checkpoint': fail('Checkpoint pai inválido.')
    data=dict(spec,goal_state=m['status'],requirements=m['requirements'],
              evidence=[x['id'] for x in s.items(mid,'evidence')],snapshot=s.snapshot_record())
    with s.tx(): return s.put(mid,'checkpoint',data)

def route(s,mid,spec):
    m=s.mission(mid); b=m['budget']
    uncertainty=float(spec.get('uncertainty',0.5)); divergence=float(spec.get('divergence',0))
    if not 0<=uncertainty<=1 or not 0<=divergence<=1: fail('Incerteza/divergência: use 0..1.')
    weight={'low':0,'medium':1,'high':2,'critical':3}[m['risk']]
    need=1 if weight==0 and uncertainty<0.4 else 3 if weight<2 and uncertainty<0.7 else 6
    if divergence>0.6: need=8
    if spec.get('large_mission') and weight>=2: need=12
    if spec.get('proven'): need=1
    native=bool(spec.get('subagents_available',False))
    count=min(need,b['max_brains']) if native else 1
    core=[1,15,17,22,30,33,36,38,39,52,57,61,68]
    extra={'debugging':[6,19,20,21,23,35,51,58,59,67],
           'security':[5,25,53,65,66,67], 'frontend':[27,29,35,65],
           'database':[7,28,29,37,53,65,66], 'performance':[26,32,35,64,65,67],
           'architecture':[2,7,16,29,48], 'research':[18,24,48,49],
           'general':[9,35,65]}.get(m['domain'],[9,35,65])
    if count>=6: extra += [4,9,10,11,42,43,44,46,47,53,55,56,60,62]
    if spec.get('parallel_tasks'): extra += [8,34]
    if spec.get('competing_solutions'): extra += [3,45]
    if spec.get('large_mission'): extra += [40,41]
    # Model availability is declared by the host. Labels from old chats are never API IDs.
    available=spec.get('available_models',['inherit'])
    if not available or any(not isinstance(x,str) for x in available): fail('Modelos disponíveis inválidos.')
    failed=set(spec.get('failed_models',[])); candidates=[x for x in available if x not in failed]
    if not candidates: return {'status':'BLOCKED_EXTERNALLY','reason':'Sem modelo disponível.'}
    scores={x:1000.0 for x in candidates}
    for r in s.db.execute('SELECT * FROM ratings WHERE domain=? AND dimension=?',(m['domain'],'model')):
        if r['entity'] in scores and r['samples']>=10:
            age=max(0,time.time()-r['updated'])/86400
            scores[r['entity']]=1000+(r['rating']-1000)*2**(-age/90)
    preferred=spec.get('preferred_model','inherit')
    # Stable tie handling preserves chosen Flash/current model in cold start.
    ordered=sorted(candidates,key=lambda x:(scores[x],x==preferred),reverse=True)
    result={'status':'READY','brains':count,'desired_brains':need,'model':ordered[0],
            'fallback':ordered[1:],'ideas':sorted(set(core+extra)),
            'mode':'NATIVE_SUBAGENTS' if native else 'SERIAL_LIMITED',
            'warning':None if native else 'Papéis sequenciais não são verificadores independentes.',
            'limits':b,'model_selection':'recommendation-to-native-host'}
    with s.tx(): s.put(mid,'route',result)
    return result

def task_add(s,mid,spec):
    s.mission(mid)
    if not spec.get('text') or not spec.get('owner'): fail('Tarefa exige text e owner.')
    deps=spec.get('dependencies',[])
    for tid in deps:
        t=s.item(tid)
        if t['mission']!=mid or t['kind']!='task': fail('Dependência inválida.')
    for f in spec.get('files',[]): s.path(f)
    # New nodes may depend only on existing nodes, making cycles impossible.
    with s.tx(): return s.put(mid,'task',dict(spec,dependencies=deps))

def reserve(s,mid,spec):
    with s.tx():
        m=s.mission(mid); b=m['budget']
        for k in ('parent','question','expected_gain','stop_condition'):
            if not spec.get(k): fail('Reserva exige '+k)
        parent=spec['parent']; depth=1
        released={x['reservation'] for x in s.items(mid,'release')}
        if parent!=mid:
            p=s.item(parent)
            if p['mission']!=mid or p['kind']!='reservation': fail('Pai inválido.')
            if parent in released: fail('Reserva pai já encerrada.')
            depth=p['depth']+1
        allres=s.items(mid,'reservation')
        live=[x for x in allres if x['id'] not in released]
        if 1+len(live)>=b['max_brains']: fail('Limite de cérebros atingido (inclui principal).')
        if depth>b['max_depth']: fail('Limite de profundidade.')
        if sum(x['parent']==parent for x in live)>=b['max_children']: fail('Limite de filhos.')
        used=s.items(mid,'usage')
        elapsed=(dt.datetime.now(dt.timezone.utc)-dt.datetime.fromisoformat(m['created'])).total_seconds()
        if elapsed>b['max_seconds']: fail('Orçamento de tempo esgotado.')
        for field in ('tokens','tool_calls'):
            if sum(x.get(field,0) for x in used)>=b['max_'+field]: fail('Orçamento esgotado: '+field)
        return s.put(mid,'reservation',dict(spec,depth=depth))

def novelty(s,mid,spec):
    s.mission(mid)
    if not spec.get('strategy') or not spec.get('error'): fail('strategy e error obrigatórios.')
    def words(x): return set(re.findall(r'\w+',x.lower()))
    fingerprint=words(spec['strategy']+' '+spec['error'])
    previous=s.items(mid,'attempt'); sim=0
    for a in previous:
        w=words(a['strategy']+' '+a['error'])
        sim=max(sim,len(w&fingerprint)/max(1,len(w|fingerprint)))
    new=bool(spec.get('new_evidence'))
    if new: s.check_evidence(mid,spec['new_evidence'])
    data=dict(spec,novelty_score=round(1-sim,3),blocked=sim>=0.85 and not new,
              metric='lexical-heuristic; agent must also inspect semantic novelty')
    with s.tx(): return s.put(mid,'attempt',data)

def consensus(s,mid,spec):
    s.mission(mid); votes=spec.get('votes',[])
    if not votes: fail('votes obrigatório.')
    seen=set(); totals={}; minority=[]; clusters=set()
    for v in votes:
        if v['agent'] in seen: fail('Agente duplicado no consenso.')
        seen.add(v['agent'])
        evidence=v.get('evidence',[])
        if evidence: s.check_evidence(mid,evidence)
        cluster=v.get('independence_group','unknown'); clusters.add(cluster)
        # No weight zero, no invented calibrated probabilities.
        w=1.0+(0.5 if evidence else 0)
        totals[v['choice']]=totals.get(v['choice'],0)+w
        if evidence: minority.append({'choice':v['choice'],'evidence':evidence,'agent':v['agent']})
    winner=max(totals,key=totals.get)
    result={'priority':winner,'weights':totals,'supported_alternatives':[v for v in minority if v['choice']!=winner],
            'independence_groups':len(clusters-{'unknown'}),
            'confidence':'UNVALIDATED' if not minority else 'EVIDENCE_PRESENT_NOT_PROBABILITY',
            'decision':'Priorizar testes; consenso não encerra missão nem elimina minoria com prova.'}
    with s.tx(): return s.put(mid,'consensus',result)

def match(s,mid,spec):
    m=s.mission(mid)
    if not spec.get('id') or not spec.get('evidence'): fail('Resultado exige id único e evidence.')
    s.check_evidence(mid,spec['evidence'])
    pairs=spec.get('pairs',[])
    if not pairs: fail('pairs obrigatório.')
    with s.tx():
        if s.db.execute('SELECT 1 FROM outcomes WHERE id=?',(spec['id'],)).fetchone(): fail('Resultado já registrado.')
        for p in pairs:
            if p['dimension'] not in ('model','agent','skill','tool','pipeline','combination'): fail('Dimensão inválida.')
            a,bb=p['a'],p['b']; score=float(p['score_a'])
            if a==bb or not 0<=score<=1: fail('Duelo inválido.')
            rows=[]
            for entity in (a,bb):
                row=s.db.execute('SELECT * FROM ratings WHERE domain=? AND dimension=? AND entity=?',
                                 (m['domain'],p['dimension'],entity)).fetchone()
                if row:
                    age=max(0,time.time()-row['updated'])/86400
                    rating=1000+(row['rating']-1000)*2**(-age/90)
                    rows.append((rating,row['samples']))
                else: rows.append((1000,0))
            expected=1/(1+10**((rows[1][0]-rows[0][0])/400)); delta=16*(score-expected)
            for entity,r,change in zip((a,bb),rows,(delta,-delta)):
                s.db.execute('INSERT OR REPLACE INTO ratings VALUES (?,?,?,?,?,?)',
                             (m['domain'],p['dimension'],entity,r[0]+change,r[1]+1,time.time()))
        s.db.execute('INSERT INTO outcomes VALUES (?,?)',(spec['id'],dumps(dict(spec,mission=mid,timestamp=now()))))
    return {'recorded':spec['id'],'routing_min_samples':10}

def context(s,mid,spec):
    s.mission(mid); query=set(re.findall(r'\w+',spec.get('query','').lower()))
    limit=int(spec.get('max_chars',12000))
    if limit<200 or limit>100000: fail('max_chars: 200..100000.')
    candidates=[]
    for item in s.items(mid):
        if item['kind'] not in KINDS: continue
        if 'snapshot' in item and not s.fresh(item): continue
        if item.get('evidence'):
            try: s.check_evidence(mid,item['evidence'])
            except ValueError: continue
        words=set(re.findall(r'\w+',item.get('text','').lower()))
        score=len(query&words)+bool(item.get('critical'))*3
        if score or not query: candidates.append((score,item))
    selected=[]; size=0
    for score,item in sorted(candidates,key=lambda x:x[0],reverse=True):
        length=len(dumps(item))
        if size+length>limit: continue
        selected.append(item); size+=length
    return {'items':selected,'chars':size,'budget_chars':limit,
            'limits':'Busca lexical em registros validados; não é embedding nem análise semântica automática.'}

def graph_add(s,mid,spec):
    s.mission(mid)
    for key in ('source','target','relation_type','evidence'):
        if not spec.get(key): fail('Grafo exige '+key)
    s.check_evidence(mid,spec['evidence'])
    spec['snapshot']=s.snapshot_record(spec.get('files'))
    with s.tx(): return s.put(mid,'edge',spec)

def blast(s,mid,node):
    edges=[e for e in s.items(mid,'edge') if s.fresh(e)]
    reached={node}; changed=True
    while changed:
        changed=False
        for e in edges:
            if e['target'] in reached and e['source'] not in reached:
                reached.add(e['source']); changed=True
    return {'affected':sorted(reached),'limits':'Só relações documentadas no grafo; ausência não prova isolamento.'}

def main(argv=None):
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--project',default='.')
    subs=p.add_subparsers(dest='cmd',required=True)
    subs.add_parser('doctor')
    n=subs.add_parser('new'); n.add_argument('--spec',required=True)
    for name in ('route','record','checkpoint','task-add','reserve','novelty','consensus','match','context','graph-add','usage','council-round'):
        a=subs.add_parser(name); a.add_argument('mission'); a.add_argument('--spec',required=True)
        if name=='record': a.add_argument('--kind',choices=sorted(KINDS),required=True)
    for name in ('status','gate','close','list','ready'):
        a=subs.add_parser(name); a.add_argument('mission')
        if name=='list': a.add_argument('--kind')
    a=subs.add_parser('verify'); a.add_argument('mission'); a.add_argument('--spec',required=True)
    a.add_argument('--timeout',type=int,default=300); a.add_argument('--command',nargs=argparse.REMAINDER,required=True)
    a=subs.add_parser('attest'); a.add_argument('mission'); a.add_argument('--spec',required=True)
    a=subs.add_parser('release'); a.add_argument('mission'); a.add_argument('reservation')
    a=subs.add_parser('resolve'); a.add_argument('mission'); a.add_argument('target'); a.add_argument('--evidence',nargs='+',required=True)
    a=subs.add_parser('task-done'); a.add_argument('mission'); a.add_argument('task'); a.add_argument('--evidence',nargs='+',required=True)
    a=subs.add_parser('restore-checkpoint'); a.add_argument('mission'); a.add_argument('checkpoint')
    a=subs.add_parser('blast'); a.add_argument('mission'); a.add_argument('node')
    a=subs.add_parser('hypotheses'); a.add_argument('mission')
    a=subs.add_parser('worktree'); a.add_argument('mission'); a.add_argument('--name',required=True)
    args=p.parse_args(argv); s=Store(args.project)
    try:
        spec=load_file(args.spec) if hasattr(args,'spec') else None
        mid=getattr(args,'mission',None)
        if args.cmd=='doctor':
            result={'version':VERSION,'python':sys.version.split()[0], 'project':str(s.root),
                    'database':'OK','git':None,'native_activation':'UNVERIFIED: confirmar dentro do Antigravity'}
            try: result['git']=subprocess.check_output(['git','--version'],text=True).strip()
            except (OSError,subprocess.CalledProcessError): pass
        elif args.cmd=='new': result=new_mission(s,spec)
        elif args.cmd=='record': result=register(s,mid,args.kind,spec)
        elif args.cmd=='verify':
            command=args.command
            if command and command[0]=='--': command=command[1:]
            if not command: fail('Comando ausente; use attest para inspeção manual.')
            result=verify(s,mid,spec,command,args.timeout)
        elif args.cmd=='attest': result=verify(s,mid,spec)
        elif args.cmd in ('gate','close'):
            result=s.gate(mid)
            if args.cmd=='close':
                with s.tx():
                    m=s.mission(mid); m['status']=result['status']; s.save_mission(m); s.put(mid,'completion',result)
        elif args.cmd=='status':
            m=s.mission(mid); result=dict(m,computed_status=s.gate(mid)['status'])
        elif args.cmd=='list': s.mission(mid); result=s.items(mid,args.kind)
        elif args.cmd=='checkpoint': result=checkpoint(s,mid,spec)
        elif args.cmd=='route': result=route(s,mid,spec)
        elif args.cmd=='task-add': result=task_add(s,mid,spec)
        elif args.cmd=='reserve': result=reserve(s,mid,spec)
        elif args.cmd=='novelty': result=novelty(s,mid,spec)
        elif args.cmd=='consensus': result=consensus(s,mid,spec)
        elif args.cmd=='match': result=match(s,mid,spec)
        elif args.cmd=='context': result=context(s,mid,spec)
        elif args.cmd=='graph-add': result=graph_add(s,mid,spec)
        elif args.cmd=='blast': result=blast(s,mid,args.node)
        elif args.cmd=='release':
            r=s.item(args.reservation)
            if r['mission']!=mid or r['kind']!='reservation': fail('Reserva inválida.')
            with s.tx(): result=s.put(mid,'release',{'reservation':r['id']})
        elif args.cmd=='usage':
            s.mission(mid)
            for k in ('tokens','tool_calls'):
                if not isinstance(spec.get(k,0),int) or spec.get(k,0)<0: fail('Uso inválido.')
            with s.tx(): result=s.put(mid,'usage',spec)
        elif args.cmd=='council-round':
            with s.tx():
                m=s.mission(mid)
                if not spec.get('council') or not spec.get('question'): fail('Rodada exige council e question.')
                rounds=[r for r in s.items(mid,'council_round') if r['council']==spec['council']]
                if len(rounds)>=m['budget']['max_rounds']: fail('Limite de rodadas do conselho.')
                if rounds and not spec.get('expected_gain'): fail('Nova rodada exige ganho esperado.')
                result=s.put(mid,'council_round',dict(spec,round=len(rounds)+1))
        elif args.cmd=='resolve':
            t=s.item(args.target)
            if t['mission']!=mid or t['kind'] not in KINDS: fail('Alvo inválido.')
            s.check_evidence(mid,args.evidence)
            with s.tx(): result=s.put(mid,'resolution',{'target':args.target,'evidence':args.evidence})
        elif args.cmd=='task-done':
            t=s.item(args.task)
            if t['mission']!=mid or t['kind']!='task': fail('Tarefa inválida.')
            if any(s.task_status(mid,d)!='DONE' for d in t['dependencies']): fail('Dependências pendentes.')
            s.check_evidence(mid,args.evidence)
            with s.tx(): result=s.put(mid,'task_status',{'task':args.task,'status':'DONE','evidence':args.evidence})
        elif args.cmd=='ready':
            s.mission(mid)
            result=[t for t in s.items(mid,'task') if s.task_status(mid,t['id'])!='DONE'
                    and all(s.task_status(mid,d)=='DONE' for d in t['dependencies'])]
        elif args.cmd=='restore-checkpoint':
            cp=s.item(args.checkpoint)
            if cp['mission']!=mid or cp['kind']!='checkpoint': fail('Checkpoint inválido.')
            result=dict(cp,fresh=s.fresh(cp),code_restored=False)
            with s.tx():
                m=s.mission(mid); m['active_checkpoint']=cp['id']; m['status']='REOPEN_REQUIRED'
                s.save_mission(m); s.event(mid,'checkpoint-selected',{'id':cp['id']})
        elif args.cmd=='hypotheses':
            s.mission(mid); result=[]
            for h in s.items(mid,'hypothesis'):
                days=max(0,(dt.datetime.now(dt.timezone.utc)-dt.datetime.fromisoformat(h['timestamp'])).total_seconds()/86400)
                supported=False
                if h.get('evidence'):
                    try: s.check_evidence(mid,h['evidence']); supported=True
                    except ValueError: pass
                result.append(dict(h,priority=h['confidence']*(1 if supported else 2**(-days/7)),
                                   refuted_by_age=False))
        elif args.cmd=='worktree':
            s.mission(mid)
            if not re.fullmatch(r'[a-z0-9][a-z0-9-]{0,40}',args.name): fail('Nome de worktree inválido.')
            directory=s.path('.gau/worktrees/'+args.name); directory.parent.mkdir(exist_ok=True)
            subprocess.run(['git','worktree','add','-b','gau/'+mid+'/'+args.name,str(directory),'HEAD'],cwd=s.root,check=True)
            result={'path':str(directory),'base':'HEAD','warning':'Mudanças não commitadas não são copiadas. Não há merge automático.'}
        else: fail('Comando não implementado.')
        print(dumps(result))
        if args.cmd in ('gate','close') and result['status']!='COMPLETE': return 2
        if args.cmd in ('verify','attest') and result['result']!='PASS': return 2
        return 0
    finally: s.close()

if __name__=='__main__':
    try: sys.exit(main())
    except (ValueError,OSError,sqlite3.Error,subprocess.SubprocessError,KeyError,TypeError) as exc:
        print(dumps({'error':str(exc)}),file=sys.stderr); sys.exit(1)
