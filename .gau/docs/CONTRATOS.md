# Contratos por ideia

Cada artefato JSON tem `mission`, `idea_id`, `status`, `source`, `scope`, `owners`, `evidence`, `unknowns` e `next_actions`. Só o coordenador grava o estado compartilhado. Agentes entregam arquivos separados.

Status de execução: PLANNED, RUNNING, VERIFIED, FAILED, BLOCKED, SERIAL_LIMITED. Não usar VERIFIED sem referências de evidência.

## 1. Adaptive Model Router 3.0
Artefato: `routing`. Gatilho: Escolher equipe/modelo no início ou após falha.
Apoio: `route`. Ler a skill `gau-01-adaptive-model-router-3-0` para decisões específicas.

## 2. Multi-Model Debate
Artefato: `debate`. Gatilho: Alta incerteza ou desacordo entre modelos disponíveis.
Apoio: `consensus`. Ler a skill `gau-02-multi-model-debate` para decisões específicas.

## 3. Solution Tournament
Artefato: `tournament`. Gatilho: Comparar implementações concorrentes com o mesmo conjunto de testes.
Apoio: `worktree`. Ler a skill `gau-03-solution-tournament` para decisões específicas.

## 4. Supreme Judge Council
Artefato: `judgment`. Gatilho: Julgar decisão crítica depois de reunir seis pareceres independentes.
Apoio: `consensus`. Ler a skill `gau-04-supreme-judge-council` para decisões específicas.

## 5. Adversarial Council
Artefato: `adversarial`. Gatilho: Buscar falhas concretas numa solução de alto risco.
Apoio: `record --kind finding`. Ler a skill `gau-05-adversarial-council` para decisões específicas.

## 6. Hypothesis Laboratory
Artefato: `hypotheses`. Gatilho: Investigar bug sem causa clara por testes discriminatórios.
Apoio: `record --kind hypothesis`. Ler a skill `gau-06-hypothesis-laboratory` para decisões específicas.

## 7. Architecture Council
Artefato: `architecture`. Gatilho: Escolher arquitetura com impacto amplo e comparar migração e manutenção.
Apoio: `record --kind decision`. Ler a skill `gau-07-architecture-council` para decisões específicas.

## 8. Coding Swarm
Artefato: `coding-dag`. Gatilho: Dividir implementação em subtarefas independentes com donos e interfaces.
Apoio: `task-add`. Ler a skill `gau-08-coding-swarm` para decisões específicas.

## 9. Verification Swarm
Artefato: `verification`. Gatilho: Verificar requisitos, execução, regressões, segurança, desempenho e integração.
Apoio: `verify`. Ler a skill `gau-09-verification-swarm` para decisões específicas.

## 10. Reasoning Ensemble
Artefato: `ensemble`. Gatilho: Comparar linhas de solução independentes antes da síntese.
Apoio: `consensus`. Ler a skill `gau-10-reasoning-ensemble` para decisões específicas.

## 11. Weighted Consensus
Artefato: `weighted-consensus`. Gatilho: Priorizar hipóteses usando evidência e pesos sem votação cega.
Apoio: `consensus`. Ler a skill `gau-11-weighted-consensus` para decisões específicas.

## 12. Model Elo Ranking
Artefato: `model-elo`. Gatilho: Registrar duelos comparáveis entre versões de modelos por domínio.
Apoio: `match`. Ler a skill `gau-12-model-elo-ranking` para decisões específicas.

## 13. Agent Elo Ranking
Artefato: `agent-elo`. Gatilho: Atribuir crédito a agentes pela contribuição comprovada.
Apoio: `match`. Ler a skill `gau-13-agent-elo-ranking` para decisões específicas.

## 14. Skill Elo Ranking
Artefato: `skill-elo`. Gatilho: Comparar skills realmente usadas e colocar experimentais em observação.
Apoio: `match`. Ler a skill `gau-14-skill-elo-ranking` para decisões específicas.

## 15. Project Brain
Artefato: `project-memory`. Gatilho: Registrar fatos estáveis, conhecimento da missão e histórico com fontes.
Apoio: `record --kind fact`. Ler a skill `gau-15-project-brain` para decisões específicas.

## 16. Semantic Code Graph
Artefato: `semantic-graph`. Gatilho: Mapear relações comprovadas de chamadas, dados, eventos e contratos.
Apoio: `graph-add`. Ler a skill `gau-16-semantic-code-graph` para decisões específicas.

## 17. Context Compiler
Artefato: `context-packet`. Gatilho: Preparar recorte de contexto relevante e limitado para cada agente.
Apoio: `context`. Ler a skill `gau-17-context-compiler` para decisões específicas.

## 18. Memory Jury
Artefato: `memory-audit`. Gatilho: Revalidar memória crítica, antiga ou conflitante.
Apoio: `record --kind knowledge`. Ler a skill `gau-18-memory-jury` para decisões específicas.

## 19. Automatic Replanning Council
Artefato: `replan`. Gatilho: Mudar o plano por nova evidência sem perder os requisitos.
Apoio: `record --kind decision`. Ler a skill `gau-19-automatic-replanning-council` para decisões específicas.

## 20. Uncertainty Council
Artefato: `uncertainty`. Gatilho: Separar suposições de fatos e identificar testes que reduzem incerteza.
Apoio: `record --kind assumption`. Ler a skill `gau-20-uncertainty-council` para decisões específicas.

## 21. Contradiction Detector
Artefato: `contradictions`. Gatilho: Conciliar afirmações considerando versão, ambiente, escopo e evidência.
Apoio: `record --kind contradiction`. Ler a skill `gau-21-contradiction-detector` para decisões específicas.

## 22. Evidence Court
Artefato: `evidence-chain`. Gatilho: Vincular conclusão relevante à reprodução e proveniência verificáveis.
Apoio: `verify`. Ler a skill `gau-22-evidence-court` para decisões específicas.

## 23. Loop Breaker Council
Artefato: `loop-break`. Gatilho: Detectar tentativas repetidas sem informação nova e mudar a estratégia.
Apoio: `novelty`. Ler a skill `gau-23-loop-breaker-council` para decisões específicas.

## 24. Research Swarm
Artefato: `research`. Gatilho: Pesquisar fontes externas quando a tarefa depende de informação atual.
Apoio: `record --kind fact`. Ler a skill `gau-24-research-swarm` para decisões específicas.

## 25. Security Council
Artefato: `security`. Gatilho: Auditar riscos concretos de autenticação, entrada, segredos, dependências, dados e runtime.
Apoio: `record --kind finding`. Ler a skill `gau-25-security-council` para decisões específicas.

## 26. Performance Council
Artefato: `performance`. Gatilho: Medir gargalo e comparar baseline/resultado sob a mesma carga.
Apoio: `verify`. Ler a skill `gau-26-performance-council` para decisões específicas.

## 27. UX Council
Artefato: `ux`. Gatilho: Avaliar interface por jornadas, acessibilidade e estados reais no navegador.
Apoio: `attest`. Ler a skill `gau-27-ux-council` para decisões específicas.

## 28. Database Council
Artefato: `database`. Gatilho: Validar schema, dados legados, transações e migrations em ambiente descartável.
Apoio: `verify`. Ler a skill `gau-28-database-council` para decisões específicas.

## 29. Integration Council
Artefato: `integration`. Gatilho: Testar fronteiras, contratos, retries, duplicação e compatibilidade de serviços.
Apoio: `verify`. Ler a skill `gau-29-integration-council` para decisões específicas.

## 30. Requirement Council
Artefato: `requirements`. Gatilho: Transformar pedido em baseline de requisitos verificáveis sem ampliar escopo.
Apoio: `new`. Ler a skill `gau-30-requirement-council` para decisões específicas.

## 31. Explanation Council
Artefato: `explanation`. Gatilho: Explicar resultados no nível solicitado usando apenas provas e limitações registradas.
Apoio: `gate`. Ler a skill `gau-31-explanation-council` para decisões específicas.

## 32. Algorithm Council
Artefato: `algorithm`. Gatilho: Comparar correção, complexidade e contraexemplos em diferentes escalas.
Apoio: `verify`. Ler a skill `gau-32-algorithm-council` para decisões específicas.

## 33. Tool Council
Artefato: `tool-plan`. Gatilho: Escolher ferramenta disponível pelo resultado esperado e definir fallback.
Apoio: `record --kind decision`. Ler a skill `gau-33-tool-council` para decisões específicas.

## 34. Parallel Worktree Swarm
Artefato: `worktree-swarm`. Gatilho: Isolar trabalhos paralelos e ordenar integração pelas dependências.
Apoio: `worktree`. Ler a skill `gau-34-parallel-worktree-swarm` para decisões específicas.

## 35. Regression Hunters
Artefato: `regression`. Gatilho: Selecionar testes de regressão por diff, contratos e histórico de fragilidade.
Apoio: `verify`. Ler a skill `gau-35-regression-hunters` para decisões específicas.

## 36. Final Completion Tribunal
Artefato: `completion-proof`. Gatilho: Encerrar missão somente com requisitos cobertos e pendências críticas resolvidas.
Apoio: `close`. Ler a skill `gau-36-final-completion-tribunal` para decisões específicas.

## 37. Rollback Brain
Artefato: `recovery-plan`. Gatilho: Recuperar estado da missão e planejar reversão seletiva do código.
Apoio: `restore-checkpoint`. Ler a skill `gau-37-rollback-brain` para decisões específicas.

## 38. Compute Governor
Artefato: `compute-budget`. Gatilho: Reservar capacidade antes de criar agente e liberar quando encerrar.
Apoio: `reserve`. Ler a skill `gau-38-compute-governor` para decisões específicas.

## 39. Meta-Orchestrator
Artefato: `orchestration-dag`. Gatilho: Escolher etapas, responsáveis e dependências de uma missão.
Apoio: `task-add`. Ler a skill `gau-39-meta-orchestrator` para decisões específicas.

## 40. Supreme Orchestrator
Artefato: `global-mission`. Gatilho: Coordenar várias frentes grandes com prioridades e bloqueios.
Apoio: `task-add`. Ler a skill `gau-40-supreme-orchestrator` para decisões específicas.

## 41. Recursive Intelligence
Artefato: `recursive-delegation`. Gatilho: Delegar investigação hierárquica com pai, ganho esperado e limite de profundidade.
Apoio: `reserve`. Ler a skill `gau-41-recursive-intelligence` para decisões específicas.

## 42. Cognitive Specialization
Artefato: `cognitive-profiles`. Gatilho: Escolher perspectivas distintas e substituir perfis redundantes.
Apoio: `record --kind council`. Ler a skill `gau-42-cognitive-specialization` para decisões específicas.

## 43. Cognitive Cross Examination
Artefato: `cross-examination`. Gatilho: Interrogar premissas com previsões testáveis e contraexemplos.
Apoio: `record --kind claim`. Ler a skill `gau-43-cognitive-cross-examination` para decisões específicas.

## 44. Same-Model Diversity
Artefato: `same-model-diversity`. Gatilho: Usar sessões isoladas do modelo disponível com perspectivas diferentes.
Apoio: `consensus`. Ler a skill `gau-44-same-model-diversity` para decisões específicas.

## 45. Intelligence Tournament Bracket
Artefato: `tournament-bracket`. Gatilho: Comparar candidatos por chaves, registrando porque cada um avançou.
Apoio: `match`. Ler a skill `gau-45-intelligence-tournament-bracket` para decisões específicas.

## 46. Dynamic Council Size
Artefato: `dynamic-size`. Gatilho: Ajustar quantidade e especialidades conforme lacunas e ganho marginal.
Apoio: `route`. Ler a skill `gau-46-dynamic-council-size` para decisões específicas.

## 47. Expert Spawning
Artefato: `expert-spawn`. Gatilho: Criar especialista temporário para lacuna concreta de conhecimento.
Apoio: `reserve`. Ler a skill `gau-47-expert-spawning` para decisões específicas.

## 48. Knowledge Decomposition
Artefato: `knowledge-map`. Gatilho: Distribuir perguntas e domínios de conhecimento entre responsáveis.
Apoio: `record --kind knowledge`. Ler a skill `gau-48-knowledge-decomposition` para decisões específicas.

## 49. Cross-Agent Teaching
Artefato: `teach-back`. Gatilho: Transmitir descoberta validada e verificar compreensão pela aplicação.
Apoio: `record --kind lesson`. Ler a skill `gau-49-cross-agent-teaching` para decisões específicas.

## 50. Agent Contradiction Memory
Artefato: `contradiction-history`. Gatilho: Registrar objeções confirmadas e falsas por agente/domínio.
Apoio: `record --kind contradiction`. Ler a skill `gau-50-agent-contradiction-memory` para decisões específicas.

## 51. Failure Pattern Memory
Artefato: `failure-pattern`. Gatilho: Relacionar assinatura de falha à causa e à correção comprovada.
Apoio: `record --kind failure`. Ler a skill `gau-51-failure-pattern-memory` para decisões específicas.

## 52. Reasoning Checkpointing
Artefato: `checkpoint`. Gatilho: Preservar fatos, decisões, hipóteses, pendências e próximos passos para retomada.
Apoio: `checkpoint`. Ler a skill `gau-52-reasoning-checkpointing` para decisões específicas.

## 53. Independent Verification Tree
Artefato: `independent-tree`. Gatilho: Distribuir verificação separadamente de quem implementou em tarefa crítica.
Apoio: `verify`. Ler a skill `gau-53-independent-verification-tree` para decisões específicas.

## 54. Model Fallback Graph
Artefato: `model-fallback`. Gatilho: Reordenar alternativas disponíveis depois de falha de modelo.
Apoio: `route`. Ler a skill `gau-54-model-fallback-graph` para decisões específicas.

## 55. Council Timeout
Artefato: `council-timeout`. Gatilho: Encerrar rodadas sem ganho ou ao atingir limite e registrar bloqueio se necessário.
Apoio: `novelty`. Ler a skill `gau-55-council-timeout` para decisões específicas.

## 56. Consensus Confidence
Artefato: `consensus-confidence`. Gatilho: Avaliar correlação e evidência sem inventar probabilidade calibrada.
Apoio: `consensus`. Ler a skill `gau-56-consensus-confidence` para decisões específicas.

## 57. Evidence Freshness Engine
Artefato: `freshness`. Gatilho: Invalidar provas depois que arquivos, logs ou artefatos mudarem.
Apoio: `gate`. Ler a skill `gau-57-evidence-freshness-engine` para decisões específicas.

## 58. Hypothesis Decay
Artefato: `hypothesis-decay`. Gatilho: Reduzir prioridade de hipótese sem novo suporte sem tratá-la como refutada.
Apoio: `hypotheses`. Ler a skill `gau-58-hypothesis-decay` para decisões específicas.

## 59. Novelty Detector
Artefato: `novelty`. Gatilho: Comparar tentativa nova com histórico e exigir diferença substancial.
Apoio: `novelty`. Ler a skill `gau-59-novelty-detector` para decisões específicas.

## 60. Minority Preservation
Artefato: `minority`. Gatilho: Preservar objeção minoritária sustentada até teste discriminatório.
Apoio: `consensus`. Ler a skill `gau-60-minority-preservation` para decisões específicas.

## 61. Risk-Based Compute
Artefato: `risk-compute`. Gatilho: Dimensionar esforço pelo impacto do erro e reversibilidade.
Apoio: `route`. Ler a skill `gau-61-risk-based-compute` para decisões específicas.

## 62. Autonomous Escalation / De-escalation
Artefato: `escalation`. Gatilho: Ampliar ou reduzir equipe após convergência, divergência ou bloqueio.
Apoio: `route`. Ler a skill `gau-62-autonomous-escalation-de-escalation` para decisões específicas.

## 63. Project-Specific Councils
Artefato: `project-councils`. Gatilho: Ajustar composição ao projeto usando experiências comprovadas.
Apoio: `record --kind council`. Ler a skill `gau-63-project-specific-councils` para decisões específicas.

## 64. Historical Benchmark Memory
Artefato: `benchmark-history`. Gatilho: Guardar resultados reais comparáveis com versões, domínio e condições.
Apoio: `match`. Ler a skill `gau-64-historical-benchmark-memory` para decisões específicas.

## 65. Self-Generated Evals
Artefato: `generated-evals`. Gatilho: Criar testes positivos e negativos derivados de critérios de aceitação.
Apoio: `verify`. Ler a skill `gau-65-self-generated-evals` para decisões específicas.

## 66. Self-Generated Adversarial Cases
Artefato: `adversarial-cases`. Gatilho: Construir casos hostis relevantes e executá-los como testes de regressão.
Apoio: `verify`. Ler a skill `gau-66-self-generated-adversarial-cases` para decisões específicas.

## 67. Counterexample Generator
Artefato: `counterexamples`. Gatilho: Reproduzir entrada concreta que possa refutar hipótese, invariante ou algoritmo.
Apoio: `verify`. Ler a skill `gau-67-counterexample-generator` para decisões específicas.

## 68. Proof Obligation System
Artefato: `proof-obligations`. Gatilho: Registrar obrigação crítica e só resolvê-la com evidência atual.
Apoio: `record --kind claim`. Ler a skill `gau-68-proof-obligation-system` para decisões específicas.

## 69. Self-Evolving Router
Artefato: `evolving-router`. Gatilho: Usar histórico contextual para recomendar combinações sem promover por nome/tier.
Apoio: `route`. Ler a skill `gau-69-self-evolving-router` para decisões específicas.
