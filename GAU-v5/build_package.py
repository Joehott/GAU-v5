from pathlib import Path
import re,json,unicodedata
R=Path(__file__).resolve().parent
P=R/'payload'
def write(path,text):
    path.parent.mkdir(parents=True,exist_ok=True);path.write_text(text,encoding='utf-8')
def slug(s):
    return re.sub('[^a-z0-9]+','-',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()).strip('-')
source=(R/'source/GAU_v5_ideias_aprovadas.md').read_text(encoding='utf-8')
parts=list(re.finditer(r'^## (\d+)\. (.+)$',source,re.M))
assert len(parts)==69
# IDs, operational entrypoint, artifact, when to load.
ops={
1:('route','routing','Escolher equipe/modelo no início ou após falha.'),
2:('consensus','debate','Alta incerteza ou desacordo entre modelos disponíveis.'),
3:('worktree','tournament','Comparar implementações concorrentes com o mesmo conjunto de testes.'),
4:('consensus','judgment','Julgar decisão crítica depois de reunir seis pareceres independentes.'),
5:('record --kind finding','adversarial','Buscar falhas concretas numa solução de alto risco.'),
6:('record --kind hypothesis','hypotheses','Investigar bug sem causa clara por testes discriminatórios.'),
7:('record --kind decision','architecture','Escolher arquitetura com impacto amplo e comparar migração e manutenção.'),
8:('task-add','coding-dag','Dividir implementação em subtarefas independentes com donos e interfaces.'),
9:('verify','verification','Verificar requisitos, execução, regressões, segurança, desempenho e integração.'),
10:('consensus','ensemble','Comparar linhas de solução independentes antes da síntese.'),
11:('consensus','weighted-consensus','Priorizar hipóteses usando evidência e pesos sem votação cega.'),
12:('match','model-elo','Registrar duelos comparáveis entre versões de modelos por domínio.'),
13:('match','agent-elo','Atribuir crédito a agentes pela contribuição comprovada.'),
14:('match','skill-elo','Comparar skills realmente usadas e colocar experimentais em observação.'),
15:('record --kind fact','project-memory','Registrar fatos estáveis, conhecimento da missão e histórico com fontes.'),
16:('graph-add','semantic-graph','Mapear relações comprovadas de chamadas, dados, eventos e contratos.'),
17:('context','context-packet','Preparar recorte de contexto relevante e limitado para cada agente.'),
18:('record --kind knowledge','memory-audit','Revalidar memória crítica, antiga ou conflitante.'),
19:('record --kind decision','replan','Mudar o plano por nova evidência sem perder os requisitos.'),
20:('record --kind assumption','uncertainty','Separar suposições de fatos e identificar testes que reduzem incerteza.'),
21:('record --kind contradiction','contradictions','Conciliar afirmações considerando versão, ambiente, escopo e evidência.'),
22:('verify','evidence-chain','Vincular conclusão relevante à reprodução e proveniência verificáveis.'),
23:('novelty','loop-break','Detectar tentativas repetidas sem informação nova e mudar a estratégia.'),
24:('record --kind fact','research','Pesquisar fontes externas quando a tarefa depende de informação atual.'),
25:('record --kind finding','security','Auditar riscos concretos de autenticação, entrada, segredos, dependências, dados e runtime.'),
26:('verify','performance','Medir gargalo e comparar baseline/resultado sob a mesma carga.'),
27:('attest','ux','Avaliar interface por jornadas, acessibilidade e estados reais no navegador.'),
28:('verify','database','Validar schema, dados legados, transações e migrations em ambiente descartável.'),
29:('verify','integration','Testar fronteiras, contratos, retries, duplicação e compatibilidade de serviços.'),
30:('new','requirements','Transformar pedido em baseline de requisitos verificáveis sem ampliar escopo.'),
31:('gate','explanation','Explicar resultados no nível solicitado usando apenas provas e limitações registradas.'),
32:('verify','algorithm','Comparar correção, complexidade e contraexemplos em diferentes escalas.'),
33:('record --kind decision','tool-plan','Escolher ferramenta disponível pelo resultado esperado e definir fallback.'),
34:('worktree','worktree-swarm','Isolar trabalhos paralelos e ordenar integração pelas dependências.'),
35:('verify','regression','Selecionar testes de regressão por diff, contratos e histórico de fragilidade.'),
36:('close','completion-proof','Encerrar missão somente com requisitos cobertos e pendências críticas resolvidas.'),
37:('restore-checkpoint','recovery-plan','Recuperar estado da missão e planejar reversão seletiva do código.'),
38:('reserve','compute-budget','Reservar capacidade antes de criar agente e liberar quando encerrar.'),
39:('task-add','orchestration-dag','Escolher etapas, responsáveis e dependências de uma missão.'),
40:('task-add','global-mission','Coordenar várias frentes grandes com prioridades e bloqueios.'),
41:('reserve','recursive-delegation','Delegar investigação hierárquica com pai, ganho esperado e limite de profundidade.'),
42:('record --kind council','cognitive-profiles','Escolher perspectivas distintas e substituir perfis redundantes.'),
43:('record --kind claim','cross-examination','Interrogar premissas com previsões testáveis e contraexemplos.'),
44:('consensus','same-model-diversity','Usar sessões isoladas do modelo disponível com perspectivas diferentes.'),
45:('match','tournament-bracket','Comparar candidatos por chaves, registrando porque cada um avançou.'),
46:('route','dynamic-size','Ajustar quantidade e especialidades conforme lacunas e ganho marginal.'),
47:('reserve','expert-spawn','Criar especialista temporário para lacuna concreta de conhecimento.'),
48:('record --kind knowledge','knowledge-map','Distribuir perguntas e domínios de conhecimento entre responsáveis.'),
49:('record --kind lesson','teach-back','Transmitir descoberta validada e verificar compreensão pela aplicação.'),
50:('record --kind contradiction','contradiction-history','Registrar objeções confirmadas e falsas por agente/domínio.'),
51:('record --kind failure','failure-pattern','Relacionar assinatura de falha à causa e à correção comprovada.'),
52:('checkpoint','checkpoint','Preservar fatos, decisões, hipóteses, pendências e próximos passos para retomada.'),
53:('verify','independent-tree','Distribuir verificação separadamente de quem implementou em tarefa crítica.'),
54:('route','model-fallback','Reordenar alternativas disponíveis depois de falha de modelo.'),
55:('novelty','council-timeout','Encerrar rodadas sem ganho ou ao atingir limite e registrar bloqueio se necessário.'),
56:('consensus','consensus-confidence','Avaliar correlação e evidência sem inventar probabilidade calibrada.'),
57:('gate','freshness','Invalidar provas depois que arquivos, logs ou artefatos mudarem.'),
58:('hypotheses','hypothesis-decay','Reduzir prioridade de hipótese sem novo suporte sem tratá-la como refutada.'),
59:('novelty','novelty','Comparar tentativa nova com histórico e exigir diferença substancial.'),
60:('consensus','minority','Preservar objeção minoritária sustentada até teste discriminatório.'),
61:('route','risk-compute','Dimensionar esforço pelo impacto do erro e reversibilidade.'),
62:('route','escalation','Ampliar ou reduzir equipe após convergência, divergência ou bloqueio.'),
63:('record --kind council','project-councils','Ajustar composição ao projeto usando experiências comprovadas.'),
64:('match','benchmark-history','Guardar resultados reais comparáveis com versões, domínio e condições.'),
65:('verify','generated-evals','Criar testes positivos e negativos derivados de critérios de aceitação.'),
66:('verify','adversarial-cases','Construir casos hostis relevantes e executá-los como testes de regressão.'),
67:('verify','counterexamples','Reproduzir entrada concreta que possa refutar hipótese, invariante ou algoritmo.'),
68:('record --kind claim','proof-obligations','Registrar obrigação crítica e só resolvê-la com evidência atual.'),
69:('route','evolving-router','Usar histórico contextual para recomendar combinações sem promover por nome/tier.')}
maint={12,13,14,50,51,63,64,69}
advanced={2,3,4,5,7,8,9,10,18,19,24,25,26,27,28,29,32,34,35,40,41,42,43,44,45,47,48,49,53}
registry=[]
for i,m in enumerate(parts):
    n=int(m[1]);name=m[2];block=source[m.end():parts[i+1].start() if i+1<len(parts) else len(source)]
    block=block.split('## Regra de arquitetura de modelos')[0]
    bullets='\n'.join(line for line in block.splitlines() if line.startswith('- '))
    command,artifact,trigger=ops[n]
    sk=f'gau-{n:02d}-{slug(name)}'
    layer='maintenance' if n in maint else 'specialized' if n in advanced else 'goal'
    file=f'skills/{sk}/SKILL.md'
    entry={'id':n,'name':name,'skill':sk,'layer':layer,'entrypoint':command,'artifact':artifact,
           'trigger':trigger,'implementation':'agent-protocol + local-runtime',
           'native_dependency':'Antigravity sessions/tools; advanced parallelism conditional' if n in advanced else 'Agent follows installed rule/skill'}
    registry.append(entry)
    steps=f'''---
name: {sk}
description: {trigger} Integra a ideia {n} do GAU v5.
---

# {name}

## 1. Entrada e Ativação

- **Gatilho**: {trigger}
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `{artifact}`.

## 2. Procedimento Operacional Específico

{bullets}

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . {command}`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/{artifact}.json`.
   - Registre: `mission`, `idea_id` ({n}), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `{artifact}.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
'''
    write(P/file,steps)
write(P/'registry.json',json.dumps({'version':'5.0.0','ideas':registry},ensure_ascii=False,indent=2))
write(P/'config.json',json.dumps({'version':'5.0.0','preferred_model_label':'Gemini 3.8 Flash',
    'native_model_tier':'inherit','model_label_is_not_api_id':True,'default_max_brains':8,
    'max_depth':2,'max_children':6,'max_rounds':3,'routing_min_samples':10,
    'external_api_enabled':False,'auto_merge':False,'auto_publish':False},indent=2))
rows=['# Integração das 69 ideias','',
      'Todas têm skill própria, contrato de execução e destino. A coluna de apoio indica o comando local, não um motor autônomo de IA.','',
      '| # | Ideia | Camada | Apoio executável | Skill |','|---|---|---|---|---|']
for e in registry: rows.append(f"| {e['id']} | {e['name']} | {e['layer']} | `{e['entrypoint']}` | `{e['skill']}` |")
write(R/'docs/MAPA-69.md','\n'.join(rows)+'\n')
contracts=['# Contratos por ideia','',
'Cada artefato JSON tem `mission`, `idea_id`, `status`, `source`, `scope`, `owners`, `evidence`, `unknowns` e `next_actions`. Só o coordenador grava o estado compartilhado. Agentes entregam arquivos separados.',
'', 'Status de execução: PLANNED, RUNNING, VERIFIED, FAILED, BLOCKED, SERIAL_LIMITED. Não usar VERIFIED sem referências de evidência.', '']
for e in registry:
    contracts += [f"## {e['id']}. {e['name']}",f"Artefato: `{e['artifact']}`. Gatilho: {e['trigger']}",f"Apoio: `{e['entrypoint']}`. Ler a skill `{e['skill']}` para decisões específicas.",'']
write(P/'docs/CONTRATOS.md','\n'.join(contracts))
# Native agents use documented names, inherited model and existing host permissions.
roles={
'requirements':('Requisitos e escopo','Extrair critérios positivos/negativos e lacunas do pedido. Não acrescentar produto ou restrição não solicitado.',[30,65,68]),
'implementer':('Implementação isolada','Implementar somente a subtarefa e arquivos atribuídos. Entregar diff, comandos e dependências; não validar a própria independência.',[8,34]),
'investigator':('Causa e hipóteses','Produzir hipóteses concorrentes e experimentos discriminatórios. Registrar refutações concretas.',[6,20,58,59]),
'architect':('Arquitetura e contratos','Comparar alternativas por simplicidade, migração, blast radius, compatibilidade e manutenção.',[7,16,29]),
'verifier':('Verificação independente','Ler requisitos e código atual; executar testes apropriados sem assumir conclusões do implementador.',[9,35,53,57]),
'evidence':('Evidência e proveniência','Reproduzir claims, verificar fontes e hashes, apontar escopo não testado e evidência obsoleta.',[22,57,68]),
'adversarial':('Contraexemplos','Construir entradas e sequências concretas que quebrem invariantes ou requisitos. Entregar reprodução.',[5,66,67]),
'security':('Segurança','Revisar autenticação, entrada, segredos, dependências, dados e runtime conforme risco real.',[25]),
'performance':('Desempenho e algoritmos','Medir baseline e após mudança no mesmo ambiente/carga. Verificar correção e escalabilidade.',[26,32]),
'ux':('Experiência de uso','Testar jornadas, teclado, acessibilidade, estados vazios/erro e consistência. Usar navegador disponível.',[27]),
'database':('Dados e migrations','Testar invariantes, legado, concorrência, interrupção parcial e recuperação em base descartável.',[28]),
'integration':('Integração','Verificar contratos producer/consumer, versões, retries e falhas de fronteira. Integrar branches em ordem do DAG.',[29,34]),
'research':('Pesquisa','Buscar fontes oficiais atuais, separar fatos de inferências e registrar versões, datas e contradições.',[24]),
'memory':('Memória e retomada','Validar fatos contra código e evidência atual; compilar recortes e checkpoints estruturados.',[15,17,18,48,49,52]),
'judge':('Síntese e fechamento','Comparar pareceres já produzidos independentemente. Falha crítica e minoria com evidência exigem investigação; executar gate.',[4,11,36,56,60]),
'orchestrator':('Coordenação de frentes','Gerenciar dependências, donos e orçamento; distribuir trabalho útil, monitorar falhas, sintetizar e finalizar.',[38,39,40,41,46,47,62])}
role_tools={
'requirements':['view_file','grep_search','find_by_name','list_dir','run_command'],
'implementer':['view_file','grep_search','find_by_name','list_dir','replace_file_content','write_to_file','run_command'],
'investigator':['view_file','grep_search','find_by_name','list_dir','run_command'],
'architect':['view_file','grep_search','find_by_name','list_dir','run_command'],
'verifier':['view_file','grep_search','find_by_name','list_dir','run_command'],
'evidence':['view_file','grep_search','find_by_name','list_dir','run_command'],
'adversarial':['view_file','grep_search','find_by_name','list_dir','run_command'],
'security':['view_file','grep_search','find_by_name','list_dir','run_command'],
'performance':['view_file','grep_search','find_by_name','list_dir','run_command'],
'ux':['view_file','grep_search','find_by_name','list_dir','run_command'],
'database':['view_file','grep_search','find_by_name','list_dir','run_command'],
'integration':['view_file','grep_search','find_by_name','list_dir','replace_file_content','write_to_file','run_command'],
'research':['view_file','grep_search','find_by_name','list_dir','run_command','read_url_content','search_web'],
'memory':['view_file','grep_search','find_by_name','list_dir','replace_file_content','write_to_file','run_command'],
'judge':['view_file','grep_search','find_by_name','list_dir','run_command'],
'orchestrator':['view_file','grep_search','find_by_name','list_dir','run_command','invoke_subagent','manage_subagents','send_message']}
for role,(title,prompt,ids) in roles.items():
    skills=[registry[i-1]['skill'] for i in ids]
    tools=role_tools.get(role,['view_file','grep_search','find_by_name','list_dir','run_command'])
    body='---\nname: gau-'+role+'\ndescription: '+title+' no GAU v5.\nsubagent: true\nmainAgent: false\nmodel: inherit\ncommandExecutionPolicy: sandbox\ntools:\n'+''.join('  - '+t+'\n' for t in tools)+'skills:\n'+''.join('  - skills/'+s+'\n' for s in skills)+'---\n\n# '+title+' — Especialista GAU v5\n\n'+prompt+'''

## Protocolo Operacional Obrigatório

1. **Recepção e Delimitação**:
   - Exija do coordenador: mission ID, pergunta ou subtarefa delimitada, arquivos permitidos, critérios de sucesso, worktree e orçamento.
   - Não inicie sem compreender o critério exato de validação.

2. **Atuação Técnica Rigorosa**:
   - Atue exclusivamente na especialidade atribuída e no escopo de arquivos permitido.
   - Para implementações, escreva código limpo com testes unitários em TDD.
   - Para investigações e auditorias, produza contraexemplos ou evidências executáveis.
   - Não edite a branch principal em paralelo com outros implementadores.

3. **Verificação de Evidência**:
   - Execute comandos de teste reais via `run_command` e registre exit codes e saídas.
   - Nunca alucine ou resuma resultados sem base factual. `echo OK` não é teste de feature.

4. **Entrega Estruturada**:
   - Produza relatório sintético contendo: resumo executivo, comandos executados, arquivos alterados/inspecionados com hashes, findings/claims e veredito.
   - Grave seu artefato no caminho de saída exclusivo designado pelo coordenador.
   - Comunique impedimentos ou bloqueios imediatamente (`BLOCKED_EXTERNALLY`).

5. **Encerramento**:
   - Libere reservas de computação e encerre sua participação assim que o critério for satisfeito ou o orçamento esgotado.
'''
    write(P/'agents'/('gau-'+role+'.md'),body)
write(P/'rules/gau-v5.md','''---
trigger: always_on
---
# GAU v5

Em pedidos de engenharia neste projeto, inclusive /goal, usar a skill gau-goal
para selecionar as extensões relevantes. O /goal continua nativo.
Apenas saudações ou perguntas simples não criam missão, council ou swarm.
Ler `.gau/registry.json` somente para selecionar mecanismos; carregar o conteúdo
apenas das skills escolhidas. Para memória, rankings e manutenção fora da missão,
usar gau-maintain. Para equipes extensas, usar gau-council.
Persistir resultados e evidências; seguir o orçamento. Encerrar pela cobertura real
dos requisitos. Skills orientam o agente; não alteram internamente o runtime do host.
''')
write(P/'skills/gau-goal/SKILL.md','''---
name: gau-goal
description: Integra GAU v5 em tarefas de engenharia e /goal, com seleção de skills, agentes, checkpoints e provas de conclusão.
---
# Integração com /goal

1. Ler `.gau/docs/OPERACAO.md`. Executar `python .gau/runtime/gau.py doctor`.
   No Windows, usar `py -3` se `python` não existir. Abrir `.gau/config.json`.
2. Preservar o pedido e criar baseline em `.gau/missions/<nome>/mission.json`
   usando o exemplo. Incluir todos os requisitos concretos e critérios de prova.
   Executar `new --spec <arquivo>` e guardar o ID retornado; retomar ID existente.
3. Descobrir capacidades reais do host. Verificar se `invoke_subagent` existe e
   quais modelos/tiers podem ser selecionados. Preencher route.json com a disponibilidade
   observada; nunca inferir uma API pelo nome comercial. O modelo principal preferido
   é o Flash escolhido pelo usuário; `inherit` mantém a seleção corrente.
4. Executar `route <id> --spec <arquivo>`. Consultar `.gau/registry.json` e ler
   as skills correspondentes aos IDs escolhidos, acrescentando as necessárias
   aos requisitos concretos. As 69 ficam disponíveis; não executar todas por inércia.
5. Aplicar os procedimentos selecionados. Criar DAG e worktrees se houver trabalho
   independente. Para delegação, seguir `.gau/docs/DELEGACAO.md`: reservar, invocar,
   monitorar, recolher resultados e liberar. Usar os perfis gau-* descobertos pelo host.
6. Implementar, investigar e verificar. Registrar evidências com `verify` ou `attest`.
   Vincular cada claim crítico a obrigação de prova. Registrar falhas, suposições e
   decisões relevantes. Criar checkpoint antes de trocar estratégia, modelo ou contexto.
7. Se surgir falha, usar hipótese/novidade e replanejar. Consultar freshness após
   mudanças; repetir apenas verificações afetadas. Respeitar limites de rodadas,
   ferramentas, tempo e cérebros; não tentar contornar limitações de conta.
8. Rodar `gate <id>` e `close <id>` antes de afirmar conclusão. Resolver todos os
   bloqueios dentro do escopo. Se depender de recurso ausente, relatar BLOCKED_EXTERNALLY
   com próximo passo concreto. Só dizer COMPLETE se os critérios tiverem prova atual.
9. Fora do caminho crítico, gau-maintain registra resultados comparáveis para melhorar
   recomendações futuras. Não atribuir crédito a modelos/skills que não participaram.

Os comandos locais não interceptam o /goal nem garantem que o host siga instruções.
O teste de ativação do README é necessário para confirmar leitura e delegação na
instalação real. Se uma regra não foi descoberta, abrir esta skill explicitamente.
''')
write(P/'skills/gau-council/SKILL.md','''---
name: gau-council
description: Executa councils, torneios e equipes GAU em tarefas complexas com subagentes nativos e limites de compute.
---
# Councils e equipes

Ler `.gau/docs/DELEGACAO.md`. Reutilizar a missão existente; se não houver, inicializar
via gau-goal. Selecionar o conselho apropriado no registry e ler sua skill.
Definir perguntas, critérios, papéis complementares e saída de cada participante.
Manter primeira rodada independente, comparar evidências, executar desafios focados
e sintetizar somente depois. Cada chamada real usa reserva contabilizada.

Para seis especialistas + juiz: seis workers e o coordenador ocupam sete posições;
o juiz pode ser executado depois que os workers terminarem e liberarem reservas.
Respeitar capacidade real. Sem ferramentas nativas, trabalhar sequencialmente com
limitação explícita e não declarar independência que não ocorreu.

Equipes de várias frentes podem ser iniciadas pelo usuário em /teamwork-preview;
problemas difíceis localizados podem usar /boost, quando disponíveis. O GAU não
invoca slash commands como se fossem executáveis de terminal. Suas skills e registros
continuam sendo o apoio da missão em qualquer modo.
''')
write(P/'skills/gau-maintain/SKILL.md','''---
name: gau-maintain
description: Mantém memória, fatos, rankings e histórico do GAU fora do caminho principal de /goal, sob pedido ou ao finalizar missão relevante.
---
# Manutenção

Ler `.gau/docs/OPERACAO.md` e selecionar ideias 12–14, 50–51, 63–64 e 69 no registry.
Consultar fatos e provas atuais; revalidar o que ficou obsoleto. Registrar lições e
padrões somente com evidência e âmbito. Usar match para duelos realmente comparáveis,
com versões exatas e crédito comprovado. Registrar custos/tempos/tokens como medidos;
se a plataforma não informar, manter desconhecido.

O router consulta ranking por projeto/domínio apenas após 10 amostras e aplica decay.
Os artefatos de Agent×Model×Skill×Tool×Style×Council×Workflow ficam em dimension
combination; analisar combinações com amostra suficiente para escolher a composição.
O runtime não treina pesos de modelos nem altera o seletor interno do Antigravity.
Não promover uma skill experimental para trusted por simples carregamento.
Não executar agenda em background ou abrir agentes permanentes. Para manutenção
recorrente, usar os recursos de agendamento disponíveis somente se solicitados.
''')
print(json.dumps({'ideas':len(registry),'skills':len(list((P/'skills').glob('*/SKILL.md'))),'agents':len(roles)}))
