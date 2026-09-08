#!/usr/bin/env python3
"""Install GAU extensions without replacing Antigravity's native /goal."""
from __future__ import annotations
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import sys
import uuid

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

ROOT=Path(__file__).resolve().parent
def digest(data): return hashlib.sha256(data).hexdigest()
def write(p,data):
    p.parent.mkdir(parents=True,exist_ok=True)
    tmp=p.with_name(p.name+'.gau-tmp-'+uuid.uuid4().hex)
    tmp.write_bytes(data); os.replace(tmp,p)
def safe(root,relative):
    path=Path(relative)
    if path.is_absolute() or '..' in path.parts: raise ValueError('Caminho inválido.')
    p=root/path
    for a in [p,*p.parents]:
        if a==root: break
        if a.is_symlink(): raise ValueError('Destino é link simbólico: '+str(a))
    if not p.resolve().is_relative_to(root): raise ValueError('Destino fora do projeto.')
    return p
def load_manifest(project):
    path=safe(project,'.gau/install-manifest.json')
    return json.loads(path.read_text(encoding='utf-8')) if path.exists() else None
def payload(project,layout):
    mapping={}
    for source in sorted((ROOT/'payload').rglob('*')):
        if not source.is_file() or '__pycache__' in source.parts: continue
        rel=source.relative_to(ROOT/'payload'); first=rel.parts[0]
        if first in ('skills','agents','rules'):
            dest=Path('.agent' if layout=='legacy' and first!='agents' else '.agents')/rel
        else: dest=Path('.gau')/rel
        mapping[dest.as_posix()]=source.read_bytes()
    mapping['.gau/source/GAU_v5_ideias_aprovadas.md']=(ROOT/'source/GAU_v5_ideias_aprovadas.md').read_bytes()
    return mapping
def install(project,layout,dry_run=False):
    old=load_manifest(project)
    if old and old['layout']!=layout: raise ValueError('Desinstale antes de trocar layout.')
    files=payload(project,layout)
    conflicts=[]
    oldfiles=old['files'] if old else {}
    for rel,data in files.items():
        p=safe(project,rel)
        if p.exists():
            if not p.is_file(): conflicts.append(rel); continue
            current=digest(p.read_bytes())
            if current!=digest(data) and current!=oldfiles.get(rel,{}).get('installed_hash'):
                conflicts.append(rel)
    if conflicts: raise ValueError('Arquivos existentes preservados; conflito em: '+', '.join(conflicts))
    if dry_run: return {'mode':'dry-run','files':list(files),'count':len(files),'conflicts':[]}
    backups={}; changed=[]
    try:
        for rel,data in files.items():
            p=safe(project,rel)
            backups[rel]=p.read_bytes() if p.exists() else None
            write(p,data); changed.append(rel)
        entries={}
        for rel,data in files.items():
            # Identical pre-existing files stay user-owned on uninstall.
            prior=oldfiles.get(rel)
            entries[rel]={'installed_hash':digest(data),'owned':prior['owned'] if prior else backups[rel] is None}
        manifest={'version':'5.0.0','layout':layout,'files':entries}
        write(safe(project,'.gau/install-manifest.json'),json.dumps(manifest,indent=2).encode())
    except BaseException:
        for rel in reversed(changed):
            p=safe(project,rel)
            if backups[rel] is None: p.unlink(missing_ok=True)
            else: write(p,backups[rel])
        raise
    return {'installed':len(files),'layout':layout,'native_goal':'preserved',
            'next':'Abra nova conversa no Antigravity e execute o teste de ativação do README.'}
def check(project):
    manifest=load_manifest(project)
    if not manifest: raise ValueError('GAU não instalado nesse projeto.')
    missing=[]; changed=[]
    for rel,meta in manifest['files'].items():
        p=safe(project,rel)
        if not p.is_file(): missing.append(rel)
        elif digest(p.read_bytes())!=meta['installed_hash']: changed.append(rel)
    return {'ok':not missing and not changed,'missing':missing,'modified':changed,
            'host_activation':'Não comprovada por inspeção de arquivos; faça o teste no Antigravity.'}
def uninstall(project):
    manifest=load_manifest(project)
    if not manifest: raise ValueError('Nenhuma instalação registrada.')
    kept=[]; removed=[]
    for rel,meta in manifest['files'].items():
        p=safe(project,rel)
        if not p.exists(): continue
        if meta['owned'] and p.is_file() and digest(p.read_bytes())==meta['installed_hash']:
            p.unlink(); removed.append(rel)
        else: kept.append(rel)
    safe(project,'.gau/install-manifest.json').unlink()
    return {'removed':len(removed),'preserved':kept,
            'state':'Memória, evidências e worktrees preservados em .gau.'}
def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--project',required=True,help='Pasta do projeto aberta no Antigravity')
    p.add_argument('--layout',choices=['modern','legacy'],default='modern')
    g=p.add_mutually_exclusive_group(); g.add_argument('--dry-run',action='store_true')
    g.add_argument('--check',action='store_true'); g.add_argument('--uninstall',action='store_true')
    a=p.parse_args(); project=Path(a.project).expanduser().resolve()
    if not project.is_dir(): raise ValueError('A pasta do projeto não existe.')
    if project==ROOT or project.is_relative_to(ROOT): raise ValueError('Escolha o projeto de trabalho, não a pasta do ZIP.')
    result=check(project) if a.check else uninstall(project) if a.uninstall else install(project,a.layout,a.dry_run)
    print(json.dumps(result,ensure_ascii=False,indent=2))
    return 2 if result.get('ok') is False else 0
if __name__=='__main__':
    try: sys.exit(main())
    except (ValueError,OSError,KeyError) as e:
        print(json.dumps({'error':str(e)},ensure_ascii=False),file=sys.stderr); sys.exit(1)
