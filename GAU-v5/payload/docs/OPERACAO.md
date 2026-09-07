# Operação do GAU v5

Os comandos abaixo são executados pelo agente na raiz do projeto. No Windows,
substituir `python` por `py -3` quando necessário. Não é necessário instalar bibliotecas.
O instalador precisa de Python 3.10 ou superior. Git é necessário apenas para worktrees.

## Inicialização e retomada

Criar diretório de missão dentro de `.gau/missions/<nome>` e copiar/adaptar os JSONs
em `.gau/examples`. Executar:

```text
python .gau/runtime/gau.py doctor
python .gau/runtime/gau.py new --spec .gau/missions/<nome>/mission.json
python .gau/runtime/gau.py status <mission-id>
python .gau/runtime/gau.py route <mission-id> --spec .gau/missions/<nome>/route.json
```

O `mission-id` é retornado por `new`; usar o mesmo até o objetivo terminar.
Requisitos ficam fixados no baseline. Se o usuário mudar o objetivo, registrar decisão
com impacto e criar missão sucessora explicitamente vinculada à anterior; não apagar
critérios para fazer o gate passar. Um exemplo simples não substitui os requisitos reais.

## Registro de conhecimento e obrigações

```text
python .gau/runtime/gau.py record <mission-id> --kind fact --spec <fact.json>
python .gau/runtime/gau.py record <mission-id> --kind hypothesis --spec <hypothesis.json>
python .gau/runtime/gau.py record <mission-id> --kind claim --spec <claim.json>
python .gau/runtime/gau.py record <mission-id> --kind finding --spec <finding.json>
python .gau/runtime/gau.py list <mission-id> --kind evidence
python .gau/runtime/gau.py hypotheses <mission-id>
python .gau/runtime/gau.py context <mission-id> --spec <context.json>
```

Tipos aceitos: fact, hypothesis, decision, contradiction, failure, lesson, assumption,
risk, finding, claim, knowledge, council, pipeline. Todos exigem `text`; fatos devem
ter `source`, `files`, `scope` e fontes adequadas. Para bloquear a conclusão com uma
obrigação, usar `critical: true`; findings HIGH/CRITICAL também bloqueiam.
`evidence` contém IDs reais de provas PASS atuais desta missão. Hipóteses exigem
`discriminating_test` e aceitam `confidence` de 0 a 1 (juízo do agente, não probabilidade
calibrada). Decay altera prioridade, não verdade. Fatos com arquivos alterados são
excluídos do compilador de contexto. Fontes externas devem ser revalidadas pelo agente:
não existe monitoramento automático da web.

## Testes e evidência

```text
python .gau/runtime/gau.py verify <mission-id> --spec <verification.json> --timeout 300 --command python -m unittest discover -s tests
python .gau/runtime/gau.py attest <mission-id> --spec <attestation.json>
python .gau/runtime/gau.py resolve <mission-id> <claim-or-finding-id> --evidence <evidence-id>
python .gau/runtime/gau.py gate <mission-id>
python .gau/runtime/gau.py close <mission-id>
```

`--command` deve ficar por último. É uma lista de argumentos; não interpreta pipes,
redirecionamentos nem scripts de shell. Para ferramentas Windows `.cmd`, invocar
explicitamente `cmd /c` e o comando apropriado. Evitar comandos com segredos em
argumentos. Os logs são locais e podem conter saída sensível do teste.

`verify` executa o comando real, captura saída, exit code, duração e SHA-256.
PASS exige exit code zero e snapshot inalterado durante a execução. O agente precisa
avaliar se o teste realmente cobre o requisito: `echo OK` não é prova de uma feature.
Se testes produzirem arquivos relevantes fora dos diretórios excluídos, isso causa
FAIL conservador. Ajustar `files` explicitamente às dependências completas do teste,
ou remover os arquivos gerados e executar novamente; não excluir código para ocultar falha.

`attest` registra inspeção humana/por agente e exige artefato local (relatório, captura,
trace). É identificado como atestado, não como execução automática. A ferramenta pode
verificar integridade dos bytes, não a veracidade semântica do relatório.

Escala de evidência do protocolo: E0 opinião; E1 inspeção rastreável; E2 reprodução;
E3 reprodução independente; E4 múltiplas condições/ambientes; E5 garantia formal sob
premissas explicitadas. O runtime atribui E2 a comandos e atestados registrados e
separa o campo `independent`. Não promove automaticamente níveis por quantidade de
agentes. Para requisitos críticos deste pacote, usar min_level 2 e independent true;
níveis superiores exigem avaliação especializada externa, não um número inventado.

Sem `files`, o snapshot inclui arquivos regulares do projeto, inclusive novos e
removidos, exceto `.git`, `.gau`, `.agents`, `.agent`, node_modules, .venv, venv,
__pycache__, .pytest_cache, dist, build, .next e coverage. Symlinks não são seguidos.
Quando a tarefa altera uma dessas pastas, declarar arquivos afetados explicitamente
em `files`; a exclusão é conveniência, não prova de irrelevância. Dados de banco,
serviços externos, ambiente e configuração fora do projeto exigem nova validação
do agente. Os hashes locais não monitoram esses sistemas.

`independent: true` exige nomes diferentes de implementador/verificador e sessão real.
O runtime valida a estrutura; o host deve fornecer identidade autêntica. Um só agente
assumindo dois papéis não satisfaz essa condição. Não completar requisito independente
quando faltarem sessões nativas.

Uma prova FAIL atual permanece aberta. Uma nova PASS que a corrige deve indicar
`resolves: ["evidence-id-da-falha"]`; falhas antigas que ficaram stale deixam de
representar a versão atual, mas continuam no histórico. Alterar código, artefato ou
log invalida a prova. O `gate` retorna código 2 enquanto faltar evidência ou houver
pendências críticas. `close` registra o resultado; não fecha internamente o /goal.

## DAG e equipe

```text
python .gau/runtime/gau.py task-add <mission-id> --spec <task.json>
python .gau/runtime/gau.py ready <mission-id>
python .gau/runtime/gau.py reserve <mission-id> --spec <reservation.json>
python .gau/runtime/gau.py release <mission-id> <reservation-id>
python .gau/runtime/gau.py usage <mission-id> --spec <usage.json>
python .gau/runtime/gau.py task-done <mission-id> <task-id> --evidence <evidence-id>
python .gau/runtime/gau.py worktree <mission-id> --name backend
```

Dependências precisam existir antes da tarefa nova: o DAG não admite ciclos.
O agente confere conflito de arquivos e distribui worktrees antes de delegar.
Worktrees partem do HEAD: não incluem alterações não commitadas. Nunca fazer commit
ou reset automático de mudanças alheias; se necessário, usar branch de integração
revisável. O comando não faz merge, cherry-pick ou exclusão de worktrees.

Reservas contam coordenador principal, filhos e netos; reservas recusam excesso.
Tempo é contado desde criação da missão. Uso de tokens/tools depende da telemetria
fornecida pelo agente; registrar desconhecido na explicação se não disponível.
Os limites locais não controlam chamadas realizadas fora do protocolo. O coordenador
é responsável por obedecer limites de rodadas, encerrar subagentes de verdade e
liberar reservas. Um release local não mata uma sessão nativa.

## Checkpoint, memória, grafo e rollback

```text
python .gau/runtime/gau.py checkpoint <mission-id> --spec <checkpoint.json>
python .gau/runtime/gau.py restore-checkpoint <mission-id> <checkpoint-id>
python .gau/runtime/gau.py graph-add <mission-id> --spec <edge.json>
python .gau/runtime/gau.py blast <mission-id> <node>
```

Checkpoint contém fatos, hipóteses, descartes, decisões, perguntas, riscos, plano e
próximas ações, além do snapshot e requisito baseline. `parent` permite ramificação.
Restaurar seleciona o estado de retomada e reabre a missão; não altera o código.
Reversão de código, migrations ou efeitos externos exige plano específico e ferramentas
adequadas. Revalidar pressupostos contra estado atual antes de continuar.

No grafo, `source` depende de `target`; `blast target` percorre consumidores transitivos.
Relações são propostas e comprovadas pelo agente. Não existe parser universal automático
capaz de deduzir toda a semântica de qualquer repositório. Ausência de aresta não prova
que uma mudança é isolada.

## Debates, novidade e aprendizado

```text
python .gau/runtime/gau.py novelty <mission-id> --spec <attempt.json>
python .gau/runtime/gau.py council-round <mission-id> --spec <round.json>
python .gau/runtime/gau.py consensus <mission-id> --spec <consensus.json>
python .gau/runtime/gau.py match <mission-id> --spec <match.json>
python .gau/runtime/gau.py route <mission-id> --spec <route.json>
```

Novidade usa similaridade lexical como alerta: o agente avalia diferença semântica.
Consenso dá prioridade, preserva alternativas com evidência e não calcula uma
probabilidade de verdade. Pareceres com mesmo `independence_group` não representam
fontes independentes. Medidas cognitivas mais finas são avaliação do protocolo,
não inferência estatística comprovada pelo código.

`match` aceita dimensões model, agent, skill, tool, pipeline e combination. Cada
resultado tem ID único, evidência atual e duelos comparáveis com score_a entre 0 e 1.
Mesmas condições, objetivo, versão e dificuldade devem ser registradas. Não comparar
latências de tarefas diferentes como se fossem a mesma medição. Elo é heurístico,
com atualização limitada (K=16), amostra mínima 10 para roteamento e meia-vida de
90 dias. O roteamento automático implementado usa a dimensão model; seleção conjunta
de agentes, skills, ferramentas e councils é feita pelo coordenador consultando
histórico/artefatos. Não há treinamento de pesos do LLM, bandit completo nem criação
de capacidade de API. Alternativa indisponível nunca deve receber execução.

## Arquivos e concorrência

`.gau/state.sqlite3` guarda registros e eventos em transações SQLite/WAL. Um
coordenador registra a memória; subagentes entregam arquivos em caminhos exclusivos.
`.gau/logs` guarda provas de execução. `.gau/missions` guarda artefatos e JSONs.
Manter esses arquivos locais. Fazer cópia com o agente parado; para backup online,
usar API sqlite3.backup (não copiar somente state.sqlite3 ignorando o WAL).
Não enviar bancos/logs em commits públicos. O instalador não altera seu .gitignore.
