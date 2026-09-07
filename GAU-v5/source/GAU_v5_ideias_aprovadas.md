# GAU v5 — Ideias aprovadas

## 1. Adaptive Model Router 3.0
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- escolher automaticamente o modelo adequado;
- decidir quando escalar de Flash para Pro/modelos especialistas;
- considerar dificuldade, risco, contexto, incerteza e tipo de tarefa;
- evitar desperdício de modelos caros em tarefas simples;
- evitar insistência de modelos leves em tarefas acima da capacidade ideal.

Observação: a implementação será feita somente após encerrarmos a rodada de discussão e seleção.


## 2. Multi-Model Debate
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- acionar múltiplos cérebros independentes para o mesmo problema;
- preservar independência inicial para evitar contaminação de raciocínio;
- usar críticos adversariais e de evidência;
- sintetizar a decisão final com um judge;
- ativar apenas quando houver alta incerteza, alto risco, conflito entre hipóteses ou nível de inteligência elevado;
- usar tipicamente 6 cérebros, com possibilidade de expansão para 8–10 em modo extremo.

Observação: não deve ser usado em tarefas simples; o Adaptive Model Router 3.0 decide quando vale o custo.


## 3. Solution Tournament
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- gerar múltiplas soluções independentes para o mesmo problema;
- usar tipicamente 6 soluções e permitir 8–12 em modo extremo;
- isolar implementações concorrentes em Git worktrees/branches separadas;
- avaliar soluções por evidência real, não apenas por opinião de um judge;
- comparar testes, build, typecheck/lint, regressões, performance, segurança, simplicidade, compatibilidade e aderência aos requisitos;
- eliminar progressivamente as soluções piores até chegar à vencedora;
- ativar apenas quando dificuldade, risco ou valor da decisão justificarem o custo.

Observação: o Adaptive Model Router 3.0 decide quando o torneio deve ser acionado.


## 4. Supreme Judge Council
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 juízes especializados + 1 sintetizador em decisões críticas;
- avaliar separadamente correctness, security, performance, maintainability/architecture, requirements e adversarial risk;
- obrigar análise independente antes de compartilhar avaliações entre juízes;
- atuar após Solution Tournament, em decisões irreversíveis, migrations, segurança, arquitetura crítica ou forte desacordo entre modelos;
- evitar falso consenso e reduzir o risco de um único judge ter uma cegueira específica;
- ativar apenas quando risco e importância justificarem custo/latência.

Observação: o Adaptive Model Router 3.0 decide quando o Supreme Judge Council deve ser acionado.


## 5. Adversarial Council
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar pelo menos 6 cérebros adversariais especializados;
- procurar falhas em bugs lógicos, segurança, edge cases, regressões, performance e requisitos ignorados;
- adicionar um Counterexample Generator para criar casos concretos capazes de quebrar a solução;
- sintetizar os achados em uma etapa de Red Team Synthesis;
- exigir correção antes da aprovação quando forem encontrados problemas relevantes;
- atuar principalmente em código crítico, autenticação, pagamentos, migrations, concorrência, tarefas long-horizon e `/goal` em níveis altos;
- ser acionado pelo Adaptive Model Router 3.0 quando risco ou incerteza forem elevados.

Observação: o objetivo do conselho é tentar destruir a solução, não escolher entre soluções concorrentes.


## 6. Hypothesis Laboratory
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- manter 6–8 hipóteses concorrentes para bugs difíceis e problemas sem causa clara;
- permitir expansão para 8–10 hipóteses em cenários extremamente nebulosos;
- atribuir cérebros independentes a linhas de investigação diferentes;
- registrar evidências a favor e contra, confiança atual, teste discriminatório e resultado;
- eliminar hipóteses fracas progressivamente e preservar hipóteses minoritárias até haver evidência suficiente;
- usar um Hypothesis Judge para comparar evidências e selecionar a causa mais provável;
- integrar-se ao Adversarial Council e ao Solution Tournament após a hipótese vencedora;
- ser acionado pelo Adaptive Model Router 3.0 apenas quando a incerteza justificar o custo.

Observação: não deve ser usado em bugs triviais ou com causa explícita.


## 7. Architecture Council
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 arquitetos especializados + 1 Architecture Judge em decisões de impacto amplo;
- avaliar simplicidade, escalabilidade, segurança, performance, manutenção, compatibilidade/migração e custo operacional;
- exigir comparação explícita de benefícios, custos, riscos, blast radius, migração, rollback, testabilidade e compatibilidade;
- impedir vitória por votação simples sem justificativa técnica;
- registrar por que a arquitetura vencedora foi escolhida e por que as alternativas perderam;
- integrar-se ao Multi-Model Debate, Adversarial Council e Supreme Judge Council em decisões críticas;
- ser acionado pelo Adaptive Model Router 3.0 apenas quando a mudança tiver impacto arquitetural real.

Observação: não deve ser usado para mudanças locais ou triviais.


## 8. Coding Swarm
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 coders + 1 Integration Brain em tarefas grandes;
- oferecer modo Parallel Decomposition para subtarefas independentes;
- oferecer modo Competitive Coding para múltiplas soluções concorrentes;
- isolar cada coder em Git worktree/branch/contexto próprios;
- exigir um Dependency DAG antes de paralelizar trabalho;
- usar o Integration Brain para coordenar interfaces, merges, compatibilidade e testes integrados;
- integrar-se ao Solution Tournament em cenários competitivos;
- ser acionado pelo Adaptive Model Router 3.0 apenas quando houver paralelismo útil ou complexidade suficiente.

Observação: nenhum swarm pode escrever simultaneamente na mesma branch principal.


## 9. Verification Swarm
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar pelo menos 6 cérebros verificadores independentes em tarefas de alto nível;
- permitir expansão para 8 verificadores em missões críticas;
- separar quem implementa de quem valida;
- dividir verificação entre testes funcionais, build/typecheck/lint, regressões, segurança, performance e requisitos originais;
- adicionar verificadores opcionais de runtime/browser real e integração/ambiente;
- exigir evidência concreta: comando executado, resultado, logs/arquivos relevantes, critério testado e checkpoint do código;
- implementar Evidence Freshness: qualquer alteração posterior invalida evidências antigas afetadas;
- permitir veto por falha crítica, sem média que esconda um FAIL relevante;
- integrar-se ao `/goal`, Adversarial Council, Supreme Judge Council e Goal Finish Auditor.

Observação: em critérios críticos, um FAIL válido bloqueia a conclusão até correção e nova verificação.


## 10. Reasoning Ensemble
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar pelo menos 6 cérebros independentes para resolver o mesmo problema sem contaminação inicial;
- permitir expansão para 8–12 cérebros em modo extremo;
- comparar convergência, divergências, evidências, contraexemplos e consistência;
- preservar hipóteses minoritárias quando houver evidência relevante;
- integrar-se ao Multi-Model Debate, Adversarial Council e Supreme Judge Council;
- ser acionado pelo Adaptive Model Router 3.0 apenas em tarefas que justifiquem múltiplas linhas independentes de raciocínio.

Observação: o Reasoning Ensemble não assume que maioria simples significa verdade.

## Regra de arquitetura de modelos
**Decisão de projeto:** para o GAU v5, o Gemini 3.8 Flash será tratado como cérebro principal/default do sistema, inclusive acima do Pro atual para o perfil de uso do pacote. O tier Pro não será automaticamente considerado superior. Ele só será usado quando benchmarks internos, histórico de sucesso ou o roteador demonstrarem vantagem concreta para uma subtarefa específica.

Consequência:
- Gemini 3.8 Flash = cérebro principal e workhorse;
- Pro = especialista opcional, não promoção automática;
- modelos externos = escolhidos por evidência e especialidade, não por nome/tier.


## 11. Weighted Consensus
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- combinar decisões de 6–11 cérebros sem usar maioria simples;
- ponderar votos por histórico, especialidade, tipo de tarefa, modelo, evidência e confiança calibrada;
- aplicar a regra central `Evidence beats vote`;
- preservar hipóteses minoritárias quando apresentarem evidência forte;
- iniciar com pesos quase iguais e aumentar a influência do Elo apenas após histórico suficiente;
- impedir peso zero para qualquer cérebro participante;
- integrar-se ao Hypothesis Laboratory, Multi-Model Debate, Reasoning Ensemble, Architecture Council e Supreme Judge Council.

Observação: consenso serve para priorizar hipóteses, não para substituir evidência verificável.


## 12. Model Elo Ranking
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- manter rankings separados de modelos por domínio/tipo de tarefa;
- usar resultados reais de missões, não apenas benchmarks públicos;
- considerar sucesso, testes, regressões, tentativas, tempo, tokens, tool calls, rollbacks e aprovação final;
- usar confiança estatística, tamanho mínimo de amostra e decay temporal;
- separar versões diferentes do mesmo modelo;
- alimentar o Adaptive Model Router 3.0 com histórico real;
- impedir que tiers/nome do modelo sejam tratados como prova de superioridade.

Observação: o Elo será contextual, por exemplo debugging, frontend, arquitetura, segurança, long-horizon e tool use, e não apenas uma nota geral.


## 13. Agent Elo Ranking
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- manter Elo separado por agente e por domínio/tipo de tarefa;
- medir desempenho real de debugger, architect, repo-scout, frontend-specialist, deep-reasoner e demais agentes;
- manter também combinações Agent × Model, permitindo descobrir qual cérebro funciona melhor com qual agente;
- usar atribuição de crédito baseada em evidência, sem premiar automaticamente todos os agentes presentes;
- considerar contribuição real para descoberta, correção, regressão evitada, solução vencedora e verificação;
- alimentar o Adaptive Model Router 3.0 e o roteador de agentes;
- usar tamanho mínimo de amostra, confiança estatística e decay temporal.

Observação: o ranking deve aprender especialização real, não criar um campeão geral para todos os tipos de tarefa.


## 14. Skill Elo Ranking
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- manter Elo separado por skill e por domínio/tipo de tarefa;
- medir se a skill foi realmente usada e se melhorou o resultado;
- considerar impacto em estratégia, erros evitados, tentativas, testes, tokens e solução vencedora;
- evitar crédito automático para skills apenas carregadas no contexto;
- criar estados EXPERIMENTAL, TRUSTED, LOW-VALUE e DISABLED;
- aplicar quarentena para skills novas até haver amostra suficiente;
- aprender combinações Agent × Model × Skill;
- alimentar o Adaptive Model Router 3.0 e o roteador de skills;
- usar confiança estatística, tamanho mínimo de amostra e decay temporal.

Observação: o sistema deve otimizar a combinação cognitiva completa, e não escolher skills apenas por nome ou popularidade.


## 15. Project Brain
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- manter memória estruturada e consultável do projeto;
- separar Stable Knowledge, Mission Knowledge e Historical Knowledge;
- registrar arquitetura, módulos, símbolos, dependências, contratos, testes, decisões, bugs conhecidos, restrições e histórico;
- permitir que múltiplos cérebros consultem recortes diferentes da mesma base;
- atualizar o conhecimento conforme novas descobertas surgirem durante `/goal`;
- associar memória a `source`, `last_verified`, `confidence` e arquivos afetados;
- marcar conhecimento como `STALE` quando mudanças no código puderem invalidá-lo;
- reduzir releitura desnecessária e melhorar tarefas long-horizon;
- integrar-se ao Adaptive Router, Reasoning Ensemble, Architecture Council, Coding Swarm e Verification Swarm.

Observação: o Project Brain não pode tratar memória antiga como verdade eterna; conhecimento afetado por mudanças deve ser revalidado.


## 16. Semantic Code Graph
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- representar semanticamente como o projeto se conecta, além de simples imports e estrutura de pastas;
- mapear call graph, fluxo de dados, contratos/interfaces, testes, runtime, eventos, configurações e dependências indiretas;
- usar 6+ cérebros especializados para construir e validar diferentes camadas do grafo;
- associar cada relação a `relation_type`, `source`, `target`, `confidence`, `evidence` e `last_verified`;
- calcular blast radius de mudanças e ajudar a prever regressões;
- detectar módulos órfãos, dependências escondidas e fluxos críticos;
- atualizar o grafo de forma incremental conforme o código muda;
- integrar-se ao Project Brain e ao futuro Context Compiler.

Observação: o grafo deve ser semântico e baseado em evidência, não apenas sintático.


## 17. Context Compiler
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- compilar contexto específico para cada agente/cérebro;
- usar como fontes o Project Brain, Semantic Code Graph, memória da missão, arquivos, testes, erros, dependências e decisões anteriores;
- executar pipeline Retrieve → Rank → Compile;
- aplicar Context Budget por agente;
- priorizar contexto por relevância, risco, recência e dependência;
- usar Progressive Context Expansion para ampliar contexto apenas quando necessário;
- detectar conflitos entre memória e código atual;
- evitar enviar o mesmo contexto completo para todos os cérebros;
- reduzir desperdício de tokens sem sacrificar entendimento;
- integrar-se aos councils, swarms e `/goal`.

Observação: mais contexto não será tratado como sinônimo automático de mais inteligência; o objetivo é maximizar sinal útil.


## 18. Memory Jury
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 jurados especializados + 1 Memory Judge opcional para auditar memórias importantes;
- classificar memórias como VALID, STALE, CONFLICTED, UNVERIFIED ou INVALID;
- verificar código atual, testes, histórico, Semantic Code Graph, mudanças recentes e dependências;
- acionar revalidação principalmente quando a memória for antiga, crítica, de baixa confiança ou conflitante;
- aplicar a regra de que evidência atual supera memória antiga;
- preservar memória obsoleta como histórico quando isso for útil;
- integrar-se ao Project Brain e ao Context Compiler para impedir propagação de contexto incorreto.

Observação: o Memory Jury não deve ser acionado para toda informação pequena, apenas quando o impacto justificar o custo.


## 19. Automatic Replanning Council
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 planejadores especializados + 1 Replanning Judge;
- detectar quando o plano original deixou de ser adequado por nova evidência, bloqueios, falhas, regressões, dependências ou loops;
- suportar Local Replan, Branch Replan e Mission Replan;
- registrar por que o plano mudou, qual evidência motivou a mudança, o que foi preservado, o que foi abandonado, checkpoint usado e novos riscos;
- recalcular dependências e DAG quando necessário;
- usar um Goal Guardian para garantir que o novo plano ainda atende ao objetivo original;
- detectar ciclos de planejamento e impedir alternância infinita entre estratégias já falhas;
- exigir estratégia estruturalmente diferente quando houver loop;
- integrar-se ao `/goal`, Project Brain, Coding Swarm e Verification Swarm.

Observação: o conselho só deve ser acionado quando houver evidência real de que o plano precisa mudar.


## 20. Uncertainty Council
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar pelo menos 6 analistas independentes + 1 Uncertainty Judge opcional;
- medir certeza factual, clareza de requisitos, certeza de causa raiz, certeza da solução, risco de regressão e evidência faltante;
- manter um Assumption Registry para registrar suposições importantes, confiança, impacto se estiverem erradas e evidência disponível;
- aplicar a regra `confidence cannot exceed evidence quality`;
- usar um Counterfactual Analyst para testar cenários em que a hipótese principal esteja errada;
- escalar automaticamente o número de cérebros conforme a incerteza;
- acionar Reasoning Ensemble, Hypothesis Laboratory e councils quando a incerteza justificar;
- integrar-se diretamente ao Adaptive Model Router 3.0 e ao `/goal`.

Observação: confiança alta sem evidência forte não deve ser aceita como certeza.


## 21. Contradiction Detector
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 scanners especializados + 1 Contradiction Judge;
- detectar conflitos entre agentes, memória, código, requisitos, testes, evidências e planos;
- diferenciar contradição real de diferença de escopo, versão, ambiente, branch ou momento;
- manter um Contradiction Graph com relações como `contradicts` e `supersedes`;
- associar afirmações a `source`, `timestamp`, `scope`, `confidence` e `evidence`;
- bloquear `/goal` quando houver conflito crítico não resolvido;
- focar debates apenas nos pontos onde existe desacordo relevante;
- integrar-se ao Project Brain, Semantic Code Graph, Memory Jury, Reasoning Ensemble e councils.

Observação: nem toda diferença entre afirmações é contradição; contexto e temporalidade devem ser considerados.


## 22. Evidence Court
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 investigadores especializados + 1 Evidence Judge opcional;
- exigir evidência verificável para conclusões importantes;
- usar papéis como Evidence Collector, Evidence Challenger, Reproduction Agent, Counterexample Hunter, Source/Provenance Auditor e Alternative Explanation Brain;
- classificar força de evidência em níveis E0–E5;
- exigir níveis mínimos de evidência conforme risco e impacto da tarefa;
- manter Evidence Chain com claim, evidence, source, test, result, timestamp e code checkpoint;
- invalidar evidências que ficarem obsoletas após mudanças relevantes no código;
- aplicar a regra `Evidence beats vote`;
- integrar-se ao Hypothesis Laboratory, Weighted Consensus, Contradiction Detector, Verification Swarm e Supreme Judge Council.

Observação: uma evidência forte pode bloquear uma conclusão majoritária se demonstrar falha real.


## 23. Loop Breaker Council
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 cérebros especializados + 1 Loop Breaker Judge;
- detectar repetição de ações, erros, hipóteses, comandos e alterações sem progresso real;
- calcular um `Loop Score` para medir probabilidade de aprisionamento em ciclo;
- manter histórico de tentativas falhas;
- impedir reutilização de estratégias falhas sem nova evidência;
- aplicar cooldown temporário em estratégias já esgotadas;
- medir `Strategy Distance` para exigir mudanças realmente estruturais de abordagem;
- escalar para Reasoning Ensemble, Hypothesis Laboratory e Automatic Replanning Council quando o loop persistir;
- permitir declaração de bloqueio real quando não houver caminho novo sustentado por evidência.

Observação: o sistema não deve confundir atividade repetitiva com progresso.


## 24. Research Swarm
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 pesquisadores independentes + 1 Blind-Spot Researcher;
- dividir pesquisa entre documentação oficial, issues/repositórios, benchmarks, changelogs, experiências reais e alternativas;
- exigir descoberta independente antes da síntese conjunta;
- registrar claims, sources, confidence, contradictions e unknowns;
- ponderar fontes por autoridade, recência, versão, reprodutibilidade e evidência;
- integrar-se ao Contradiction Detector e Evidence Court quando houver conflito entre fontes;
- preservar descobertas relevantes no Project Brain com source, version, date, confidence e scope;
- marcar conhecimento externo como STALE quando ficar desatualizado;
- ser acionado em tarefas `/goal` que dependam de informação externa.

Observação: documentação oficial tem prioridade de autoridade, mas não é tratada como infalível ou necessariamente atual.


## 25. Security Council
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 especialistas de segurança + 1 Security Judge;
- cobrir autenticação/permissões, injections/inputs, secrets/crypto, dependências/supply chain, dados/privacidade e runtime attack surface;
- gerar Threat Model automático antes da análise profunda;
- registrar findings com evidence, affected_scope, exploitability, impact, confidence, recommended_fix e verification_required;
- usar severidades INFO, LOW, MEDIUM, HIGH e CRITICAL;
- exigir evidência técnica para findings relevantes;
- bloquear conclusão em falhas HIGH/CRITICAL até correção e nova verificação;
- integrar-se ao Adversarial Council, Evidence Court e Verification Swarm;
- ser acionado apenas quando o risco de segurança justificar o custo.

Observação: suspeita sem evidência suficiente não deve bloquear uma tarefa sozinha.


## 26. Performance Council
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 especialistas de performance + 1 Performance Judge;
- cobrir CPU, memória, I/O/rede, banco/queries, concorrência/latência e algoritmo/complexidade;
- operar em modos Bottleneck Hunt, Optimization Tournament e Regression Guard;
- exigir benchmarks e métricas antes/depois, incluindo latência, CPU, memória, throughput, queries e I/O quando aplicáveis;
- manter Performance Budgets definidos por projeto;
- bloquear regressões relevantes ou exigir justificativa explícita;
- impedir otimizações que melhorem velocidade às custas de correção, segurança, compatibilidade ou manutenção;
- integrar-se ao Coding Swarm, Solution Tournament, Verification Swarm e Evidence Court.

Observação: o sistema deve localizar o gargalo real antes de otimizar.


## 27. UX Council
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 especialistas de UX + 1 UX Judge;
- avaliar clareza da interface, fluxo do usuário, acessibilidade, consistência, estados de erro/vazio e carga cognitiva;
- executar User Journey Attack com perfis e cenários distintos;
- detectar regressões de experiência mesmo quando testes técnicos estiverem verdes;
- usar UX Regression Guard em mudanças de interface;
- aproveitar browser/runtime real quando disponível para validar comportamento de verdade;
- ser acionado apenas quando houver impacto real na experiência do usuário;
- integrar-se ao Coding Swarm, Verification Swarm e Supreme Judge Council.

Observação: o UX Council não deve ser usado em tarefas puramente backend sem impacto de experiência.


## 28. Database Council
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 especialistas de banco de dados + 1 Database Judge;
- cobrir schema/modelagem, queries, migrations, integridade, concorrência/transações e escala de produção;
- executar Migration Simulator antes de migrations críticas;
- verificar dados nulos, duplicados, legados, grandes volumes, rollback e interrupção parcial;
- executar Zero-Downtime Check para compatibilidade entre versões de aplicação e schema;
- manter invariantes explícitas de dados e testá-las após mudanças;
- bloquear alterações que sejam sintaticamente válidas mas operacionalmente inseguras;
- integrar-se ao Architecture Council, Performance Council, Verification Swarm e Evidence Court.

Observação: SQL válido não será tratado como sinônimo de migration segura.


## 29. Integration Council
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 especialistas de integração + 1 Integration Judge;
- cobrir contratos de API, contratos de dados, interação entre serviços, dependências externas, ambientes e propagação de falhas;
- gerar Contract Matrix com producer, consumer, schema/version, assumptions, error behavior, timeout, retry policy, compatibility e tests;
- gerar Compatibility Matrix entre versões de frontend, backend, banco, serviços e demais componentes;
- executar testes de falha nas fronteiras do sistema, como retries, duplicação, timeouts, serviços indisponíveis e versões incompatíveis;
- exigir evidências de integração por contract tests, integration tests, runtime traces, realistic fixtures, E2E e sandbox APIs quando disponíveis;
- integrar-se ao Semantic Code Graph, Database Council, Security Council, Performance Council e Verification Swarm.

Observação: teste unitário verde não será tratado como prova de integração completa.


## 30. Requirement Council
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 analistas de requisitos + 1 Requirement Judge;
- separar requisitos literais, restrições implícitas, critérios de aceitação, edge cases, conflitos e controle de escopo;
- gerar uma Requirement Baseline versionada para cada missão relevante;
- detectar Requirement Drift durante a execução;
- permitir evolução controlada por Requirement Change Proposal + análise de impacto;
- manter Traceability Matrix ligando requisito → arquitetura → arquivos → implementação → testes → evidência;
- impedir que o sistema invente escopo extra ou deixe requisitos importantes sem cobertura;
- integrar-se ao Architecture Council, Coding Swarm, Verification Swarm e `/goal`.

Observação: implementação tecnicamente correta não será considerada concluída se atender ao requisito errado.


## 31. Explanation Council
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 especialistas de explicação + 1 Explanation Judge;
- cobrir explicação técnica, tradução para iniciantes, decisões, riscos, evidências e próximos passos;
- oferecer modos BRIEF, NORMAL, DEEP e FORENSIC;
- adaptar a explicação ao público-alvo;
- manter rastreabilidade entre afirmações, fontes, evidências e confiança;
- impedir conclusões explicativas sem sustentação no Verification Swarm ou Evidence Court;
- sintetizar uma resposta única sem repetição desnecessária;
- integrar-se ao Requirement Council, councils, swarms, Evidence Court e `/goal`.

Observação: a explicação final deve refletir o que foi realmente verificado, e não apenas soar convincente.


## 32. Algorithm Council
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 especialistas algorítmicos + 1 Algorithm Judge;
- cobrir baseline/brute force, complexidade, estruturas de dados, algoritmos alternativos, edge cases e prova de correção;
- comparar soluções por correção, tempo, memória, escalabilidade, simplicidade, estabilidade e facilidade de implementação;
- executar Scale Simulation para avaliar comportamento em diferentes ordens de grandeza;
- executar Counterexample Tournament para tentar quebrar a solução favorita;
- rejeitar soluções que apenas passem em testes pequenos, mas tenham complexidade inadequada;
- integrar-se ao Reasoning Ensemble, Solution Tournament, Performance Council, Verification Swarm e Evidence Court.

Observação: passar nos testes não será tratado como prova de que o algoritmo é adequado em escala.


## 33. Tool Council
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 especialistas de ferramentas + 1 Tool Judge;
- cobrir descoberta de ferramentas, capability matching, confiabilidade, custo/latência, risco e fallback;
- gerar Tool Plan com tool, purpose, expected_output, fallback, risk e success_criteria;
- escolher não apenas a ferramenta, mas também a melhor sequência de uso;
- manter Tool Elo por tipo de tarefa e por combinação Agent × Model × Tool;
- registrar falhas de ferramentas e usar esse histórico para melhorar futuras escolhas;
- impedir tool calls sem ganho claro de informação ou capacidade de execução;
- integrar-se ao Adaptive Model Router 3.0, Context Compiler e `/goal`.

Observação: ferramenta disponível não significa ferramenta necessária.


## 34. Parallel Worktree Swarm
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6+ worktrees isolados, cada um com branch, contexto e estado próprios;
- suportar modos Competitive Worktrees, Parallel Feature Worktrees e Experimental Worktrees;
- permitir que soluções concorrentes alterem inclusive os mesmos arquivos sem contaminar a branch principal;
- criar checkpoints/snapshots automáticos para rollback rápido;
- calcular Merge Readiness Score com testes, build, regressões, segurança, performance, compatibilidade, conflitos e cobertura de requisitos;
- impedir que score alto esconda falhas críticas;
- calcular Smart Merge Order com base em dependências;
- usar normalmente 6 workers + 1 Worktree Coordinator + 1 Integration Brain, podendo escalar para 8–12 worktrees;
- integrar-se ao Coding Swarm, Solution Tournament, Integration Council e Verification Swarm.

Observação: nenhuma worktree entra na branch principal sem evidência suficiente de segurança e compatibilidade.


## 35. Regression Hunters
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 Regression Hunters + 1 Regression Judge;
- cobrir regressões de comportamento, compatibilidade de API, histórico de testes, impacto de dependências, ambientes e edge cases;
- usar Semantic Code Graph, Git diff, Project Brain e histórico de falhas para selecionar testes de regressão relevantes;
- comparar comportamento Before vs After quando possível;
- manter Historical Fragility Map para identificar áreas que quebram com frequência;
- bloquear conclusão quando comportamento antigo quebrar sem requisito que justifique a mudança;
- distinguir feature nova funcionando de ausência real de regressões;
- integrar-se ao Integration Council, Verification Swarm, Evidence Court e Supreme Judge Council.

Observação: teste novo passando não invalida uma regressão detectada em comportamento legado.


## 36. Final Completion Tribunal
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 auditores especializados + 1 Completion Judge;
- verificar requisitos, testes, regressões, riscos, evidências e escopo antes de encerrar `/goal`;
- usar estados COMPLETE, COMPLETE_WITH_KNOWN_RISKS, INCOMPLETE, BLOCKED_EXTERNALLY e REOPEN_REQUIRED;
- gerar Completion Proof com cobertura de requisitos, testes críticos, regressões, findings abertos, freshness das evidências, assumptions e blockers;
- impedir maioria/média de esconder falhas críticas;
- gerar Goal Closure Checklist dinâmica conforme o tipo de tarefa;
- reabrir automaticamente a missão quando houver falha crítica válida;
- integrar-se a todos os councils, swarms, Evidence Court e Verification Swarm.

Observação: `/goal` só pode declarar sucesso quando houver prova suficiente de conclusão.


## 37. Rollback Brain
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 cérebros especializados + 1 Rollback Judge;
- suportar Local Rollback, Branch Rollback e Mission Rollback;
- identificar quais mudanças realmente causaram a falha;
- preservar alterações boas e reverter apenas o que for necessário;
- executar Rollback Safety Check para banco, migrations, arquivos, APIs, contratos, caches, filas e side effects;
- gerar Recovery Plan após a reversão;
- registrar Failure Memory com strategy, failure_reason, evidence, affected_files, checkpoint, reverted_changes, preserved_changes e lessons;
- integrar-se ao Loop Breaker Council, Automatic Replanning Council, Project Brain, Parallel Worktree Swarm e Final Completion Tribunal.

Observação: rollback não deve significar apagar todo o progresso; o objetivo é voltar ao último estado seguro preservando trabalho válido.


## 38. Compute Governor
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- controlar orçamento de inteligência por missão;
- decidir número de cérebros, modelos, contexto, tool calls e rodadas de debate;
- usar níveis FAST, SMART, DEEP, EXPERT, COUNCIL e SWARM;
- adaptar dinamicamente o tamanho de councils e swarms conforme dificuldade, incerteza, risco, valor esperado, custo e lacuna de evidência;
- suportar escalada e de-escalada automática;
- aplicar `Stop When Proven` para evitar compute ornamental;
- manter soft limits e hard limits para brain budget, token budget, tool-call budget, debate-round budget e time budget;
- usar Model Elo, Agent Elo, Skill Elo e Tool Elo para compor equipes eficientes;
- tratar Gemini 3.8 Flash como workhorse principal por padrão, sem promover automaticamente para Pro.

Observação: mais compute só deve ser usado quando houver ganho esperado real de qualidade, segurança ou evidência.


## 39. Meta-Orchestrator
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- operar acima de agentes, councils, swarms e routers;
- escolher a arquitetura cognitiva completa de cada missão;
- decidir pipeline, ordem das etapas, councils necessários, paralelismo, checkpoints e pontos de consenso;
- usar um Orchestration Council com 6 cérebros + 1 Meta Judge quando a missão justificar;
- representar a missão como um Cognitive DAG;
- permitir Pipeline Mutation quando novas evidências mudarem as necessidades da missão;
- manter Orchestration Memory e ranking histórico de workflows/pipelines;
- obedecer ao Compute Governor para evitar ativação excessiva;
- integrar-se ao Requirement Council, Adaptive Router, Replanning e Final Completion Tribunal.

Observação: o Meta-Orchestrator organiza os outros cérebros; ele não deve executar trabalho especializado que possa ser delegado.


## 40. Supreme Orchestrator
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- operar acima de múltiplos Meta-Orchestrators em missões enormes;
- usar 6 cérebros executivos + 1 Supreme Judge;
- manter Global Mission Graph com status, owner, dependencies, risk, confidence, evidence, progress, blockers e compute_used;
- redistribuir dinamicamente cérebros e compute entre frentes conforme prioridade e risco;
- resolver conflitos entre councils por revisão cruzada de evidências;
- acompanhar Mission Health global;
- pausar frentes bloqueadas e realocar recursos para gargalos reais;
- ser reservado para missões EXPERT/COUNCIL/SWARM e projetos multifase;
- integrar-se ao Meta-Orchestrator, Compute Governor, Adaptive Router, councils, swarms e Final Completion Tribunal.

Observação: o Supreme Orchestrator governa a missão inteira; não deve ser acionado para tarefas comuns ou locais.


## 41. Recursive Intelligence
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 cérebros principais com capacidade de criar subcérebros temporários sob demanda;
- permitir raciocínio hierárquico em múltiplos níveis;
- exigir que cada subcérebro declare question, expected_information_gain, budget, parent e stop_condition;
- limitar `max_depth`, `max_children`, brain budget, time budget e evidence threshold;
- evitar comunicação irrestrita entre todos os ramos, usando síntese por pai/orquestrador;
- permitir Minority Escalation quando um subcérebro encontrar evidência forte contra a hipótese do pai;
- integrar-se ao Supreme Orchestrator, Meta-Orchestrator, Compute Governor e Evidence Court;
- ser reservado para tarefas COUNCIL/SWARM ou problemas realmente complexos.

Observação: profundidade recursiva só deve crescer quando houver ganho esperado real de informação.


## 42. Cognitive Specialization
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6+ cérebros com estilos cognitivos diferentes, evitando múltiplos agentes pensando quase da mesma forma;
- incluir perfis como Causal, Counterfactual, Mathematical, Practical Engineering, Adversarial, Evidence, Simplifier, Creative, Risk e Synthesis;
- permitir que o Meta-Orchestrator monte equipes cognitivas diferentes conforme o tipo de tarefa;
- manter Cognitive Diversity Score para medir diversidade real do council;
- substituir perfis redundantes quando a diversidade estiver baixa;
- aprender combinações Model × Agent × Cognitive Style por histórico e Elo;
- integrar-se ao Reasoning Ensemble, Architecture Council, Hypothesis Laboratory, Algorithm Council, Research Swarm e Supreme Judge Council.

Observação: quantidade de cérebros não será tratada como diversidade se todos seguirem praticamente a mesma linha de raciocínio.


## 43. Cognitive Cross Examination
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6 examinadores especializados + 1 Cross-Examination Judge;
- questionar premissas, evidências, lógica, contraexemplos, explicações alternativas e escopo;
- exigir previsões testáveis para hipóteses importantes;
- manter rodadas limitadas de apresentação, perguntas, respostas com evidência e contraexemplos;
- preservar Minority Protection quando um desafio relevante não for respondido;
- registrar Surviving Claims que resistirem ao interrogatório;
- integrar-se ao Reasoning Ensemble, Contradiction Detector, Evidence Court, Weighted Consensus e Supreme Judge Council;
- usar o Compute Governor para limitar rodadas e custo.

Observação: o objetivo é testar o raciocínio que levou à solução, não apenas tentar quebrar a implementação final.


## 44. Same-Model Diversity
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- usar 6+ execuções independentes do mesmo modelo quando isso for mais forte ou mais disponível que misturar modelos inferiores;
- permitir múltiplas instâncias do Gemini 3.8 Flash como base de councils e ensembles;
- aplicar estilos cognitivos diferentes entre instâncias;
- manter isolamento inicial para evitar efeito manada;
- executar fases independent reasoning → compare → challenge → synthesis;
- calcular Reasoning Correlation / Cognitive Diversity para medir diversidade real;
- adicionar outros modelos apenas quando a diversidade ou a especialização exigir;
- integrar-se ao Compute Governor, Model Elo, Cognitive Specialization, Cognitive Cross Examination, Evidence Court e Weighted Consensus.

Observação: múltiplas instâncias do mesmo modelo não serão tratadas como diversidade real se produzirem linhas de raciocínio altamente correlacionadas.


## 45. Intelligence Tournament Bracket
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- comparar 6–16 cérebros em formato de torneio por chaves;
- aplicar o torneio a linhas de raciocínio, planos, hipóteses e estratégias, não apenas implementações;
- avaliar cada duelo por evidência, correção, requisitos, contraexemplos, simplicidade, riscos e consistência;
- usar Elo apenas para seeding, nunca como decisão automática do vencedor;
- aplicar a regra `Evidence beats ranking`;
- usar Winner Inheritance para preservar contribuições úteis de soluções eliminadas;
- permitir preliminares, quartas, semifinais e final conforme o número de cérebros;
- integrar-se ao Solution Tournament, Reasoning Ensemble, Weighted Consensus e Compute Governor.

Observação: o objetivo é reduzir a carga de síntese global e preservar rastreabilidade clara de por que cada linha de raciocínio avançou ou foi eliminada.


## 46. Dynamic Council Size
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- adaptar dinamicamente o número de cérebros de cada council durante a missão;
- considerar incerteza, risco, divergência, qualidade da evidência, complexidade, impacto e histórico;
- calcular Marginal Brain Value antes de adicionar novos cérebros;
- expandir o council por especialidade quando surgir uma lacuna específica;
- remover ou substituir cérebros altamente redundantes;
- adaptar também o Council Shape, não apenas a quantidade de participantes;
- operar dentro dos limites definidos pelo Compute Governor;
- integrar-se ao Uncertainty Council, Cognitive Diversity Score, Elo histórico e councils especializados.

Observação: mais cérebros só devem ser adicionados quando houver ganho esperado real de informação, diversidade ou segurança.


## 47. Expert Spawning
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- criar especialistas temporários sob demanda quando houver lacuna real de expertise;
- justificar cada spawn com expertise_gap, expected_gain, scope, budget, lifetime e success_criteria;
- permitir Specialist Packs com até 6 cérebros contextuais para domínios específicos;
- evitar manter centenas de agentes permanentes carregados sem necessidade;
- avaliar utilidade do especialista após a missão;
- promover conhecimento útil para skill, memória, perfil reutilizável ou agente permanente apenas quando houver evidência de valor recorrente;
- integrar-se ao Meta-Orchestrator, Agent Elo, Skill Elo, Compute Governor e Project Brain.

Observação: especialistas temporários devem existir apenas enquanto agregarem valor real à missão.


## 48. Knowledge Decomposition
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- decompor problemas grandes em domínios de conhecimento, não apenas em subtarefas;
- usar 6+ Knowledge Owners especializados;
- atribuir a cada owner domain, scope, key_questions, sources, dependencies, unknowns e confidence;
- executar Knowledge Merge para unir mapas parciais em uma visão coerente;
- detectar Knowledge Gaps explicitamente;
- calcular Knowledge Coverage Score por domínio;
- suportar conhecimento hierárquico para projetos grandes;
- integrar-se ao Project Brain, Context Compiler, Recursive Intelligence, Contradiction Detector e Expert Spawning;
- exigir source, evidence, confidence e last_verified para fatos relevantes.

Observação: resumo de conhecimento não deve virar verdade automática; conhecimento precisa continuar rastreável e revalidável.


## 49. Cross-Agent Teaching
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- permitir que agentes especializados ensinem descobertas verificadas a outros agentes sem retransmitir contexto bruto;
- criar lições rastreáveis com fato, evidência, aplicabilidade, confiança e fonte original;
- usar Evidence Check antes da propagação;
- usar Teach-Back para verificar se o conhecimento foi compreendido corretamente;
- distribuir cada lição apenas aos agentes que realmente precisam dela;
- manter Lesson Library separada em Mission Lessons, Project Lessons e Reusable Lessons;
- impedir telefone sem fio, mantendo referência à evidência original;
- aprender por histórico quais agentes ensinam e assimilam melhor cada tipo de conhecimento;
- integrar-se ao Knowledge Decomposition, Project Brain, Context Compiler e Recursive Intelligence.

Observação: resumo produzido por agente não deve virar verdade apenas porque foi repetido por outros agentes.


## 50. Agent Contradiction Memory
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- manter histórico de contradições levantadas, confirmadas e falsas por agente e por domínio;
- calcular Minority Precision para medir a qualidade histórica de objeções minoritárias;
- registrar domínio, evidência usada, impacto final e resultado da divergência;
- manter Pairwise Contradiction History para pares de agentes que discordam com frequência;
- usar reputação de contradição apenas para priorizar investigação, nunca como prova de verdade;
- aplicar a regra `Evidence beats reputation`;
- integrar-se ao Contradiction Detector, Weighted Consensus, Minority Protection, Evidence Court, Agent Elo, Meta-Orchestrator e Dynamic Council Size.

Observação: um agente pode não ser o melhor solucionador e ainda assim ser excelente em detectar erros dos outros; essa habilidade deve ser medida separadamente.


## 51. Failure Pattern Memory
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- manter Failure Fingerprints com assinatura do erro, subsistema, ambiente, trigger, causa raiz, estratégias falhas, correção vencedora, regressões e evidências;
- minerar padrões recorrentes entre falhas históricas;
- usar Preemptive Failure Warning antes de mudanças que coincidam com padrões perigosos conhecidos;
- transformar padrões bem confirmados em regression tests, verification rules, skills ou constraints;
- usar sample_count, confidence, last_seen, affected_versions e last_verified;
- marcar padrões como STALE quando arquitetura ou versões mudarem;
- aplicar a regra `History suggests; Evidence decides`;
- integrar-se ao Project Brain, Hypothesis Laboratory, Loop Breaker Council, Rollback Brain, Verification Swarm e Expert Spawning.

Observação: a memória deve aprender com falhas antigas sem assumir que o mesmo padrão continua válido para sempre.


## 52. Reasoning Checkpointing
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- criar checkpoints estruturados do estado cognitivo da missão;
- registrar goal_state, requirements, known_facts, assumptions, hypotheses, rejected_paths, decisions, evidence, open_questions, risks, current_plan, next_actions e code_checkpoint;
- usar validadores especializados para fatos, hipóteses, evidências, decisões, riscos e continuidade;
- permitir branching de raciocínio para estratégias concorrentes;
- permitir Cognitive Rollback quando uma premissa posterior for refutada;
- vincular checkpoints a commit, hashes/arquivos, versão do Project Brain e versão do Semantic Code Graph;
- marcar checkpoints como parcialmente STALE quando mudanças relevantes invalidarem parte do conhecimento;
- integrar-se ao Hypothesis Laboratory, Solution Tournament, Parallel Worktree Swarm, Replanning e Verification.

Observação: o objetivo é preservar continuidade intelectual real da missão, não apenas um resumo textual.


## 53. Independent Verification Tree
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- criar uma árvore de verificação totalmente independente da árvore de implementação;
- impedir que o mesmo raciocínio que gerou a solução seja a única fonte de validação;
- usar múltiplos verificadores em ramos separados para requisitos, testes, regressões, segurança, performance e integração;
- exigir síntese apenas após verificações independentes;
- integrar-se ao Verification Swarm, Evidence Court e Final Completion Tribunal.

Observação: independência de verificação é obrigatória em tarefas críticas.


## 54. Model Fallback Graph
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- manter um grafo de fallback entre modelos por domínio e capacidade;
- trocar automaticamente de modelo quando houver indisponibilidade, lentidão, falha ou baixa performance;
- usar Model Elo e histórico real para ordenar alternativas;
- preservar continuidade da missão durante a troca;
- evitar fallback burro baseado apenas em tier ou nome do modelo;
- integrar-se ao Adaptive Model Router 3.0 e Compute Governor.

Observação: fallback deve respeitar competência por tarefa e não apenas disponibilidade.


## 55. Council Timeout
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- limitar duração e número de rodadas de councils;
- medir ganho marginal de cada nova rodada;
- encerrar quando não houver novidade, evidência adicional ou redução de incerteza;
- escalar para outro mecanismo quando o council travar;
- impedir debates circulares e consumo inútil de compute;
- integrar-se ao Compute Governor e Loop Breaker Council.

Observação: timeout não significa cortar raciocínio útil; significa parar quando o retorno marginal cair demais.


## 56. Consensus Confidence
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- medir a confiabilidade do consenso, não apenas sua quantidade;
- considerar independência entre cérebros, diversidade cognitiva, qualidade da evidência e correlação de raciocínio;
- reduzir confiança de consensos altamente correlacionados;
- elevar confiança quando múltiplas linhas independentes convergirem com evidência forte;
- integrar-se ao Weighted Consensus, Same-Model Diversity e Cognitive Diversity Score.

Observação: 6 respostas iguais não equivalem automaticamente a 6 evidências independentes.


## 57. Evidence Freshness Engine
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- rastrear validade temporal e estrutural de testes, logs, benchmarks e demais evidências;
- vincular evidências a code checkpoint, arquivos afetados, versão e timestamp;
- invalidar automaticamente evidências impactadas por mudanças posteriores;
- revalidar apenas o que ficou stale, evitando repetir trabalho desnecessário;
- integrar-se ao Evidence Court, Verification Swarm, Project Brain e Final Completion Tribunal.

Observação: evidência antiga não deve continuar valendo depois que o estado relevante do sistema mudar.


## 58. Hypothesis Decay
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- reduzir gradualmente o peso de hipóteses que permanecem sem nova evidência;
- preservar hipóteses antigas quando ainda houver suporte forte;
- evitar apego excessivo a teorias que sobreviveram apenas por inércia;
- combinar decay com evidence strength e recência;
- integrar-se ao Hypothesis Laboratory e Uncertainty Council.

Observação: decay reduz prioridade, mas não refuta uma hipótese por si só.


## 59. Novelty Detector
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- detectar se uma nova tentativa é realmente diferente das anteriores;
- comparar estratégia, arquivos, comandos, hipóteses e lógica de abordagem;
- gerar Novelty Score;
- bloquear pseudo-novidade que apenas repete estratégia falha com pequenas mudanças;
- integrar-se ao Loop Breaker Council, Solution Tournament e Automatic Replanning Council.

Observação: mudar detalhes superficiais não transforma uma estratégia antiga em abordagem nova.


## 60. Minority Preservation
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- preservar hipóteses minoritárias com evidência relevante;
- impedir eliminação automática por maioria simples;
- escalar minorias fortes para verificação adicional;
- usar Minority Precision, Agent Contradiction Memory e Evidence Court;
- manter trilha de por que a hipótese minoritária foi preservada ou descartada.

Observação: minoria não ganha por ser minoria; ganha direito a investigação quando houver evidência.


## 61. Risk-Based Compute
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- alocar mais compute quando o custo potencial de errar for alto;
- considerar impacto, reversibilidade, segurança, dados, produção e blast radius;
- reduzir compute em tarefas locais, triviais ou facilmente reversíveis;
- combinar risco com incerteza e evidência faltante;
- integrar-se ao Compute Governor, Security Council e Final Completion Tribunal.

Observação: risco real deve influenciar orçamento cognitivo mais do que complexidade aparente.


## 62. Autonomous Escalation / De-escalation
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- escalar ou reduzir automaticamente o número de cérebros e mecanismos durante a missão;
- mover entre 1, 3, 6, 8 e 12+ cérebros conforme risco, incerteza, divergência e evidência;
- ativar councils adicionais quando necessário;
- desativar capacidade excedente quando o problema convergir;
- integrar-se ao Dynamic Council Size e Compute Governor.

Observação: a potência cognitiva deve acompanhar o estado real da missão, não ficar fixa do início ao fim.


## 63. Project-Specific Councils
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- aprender quais councils e especialistas fazem mais sentido em cada projeto;
- adaptar composição com base em stack, arquitetura, histórico de falhas e criticidade;
- criar perfis de council específicos do repo;
- reutilizar combinações comprovadamente eficientes;
- integrar-se ao Project Brain, Agent Elo, Skill Elo e Meta-Orchestrator.

Observação: cada projeto pode exigir uma arquitetura cognitiva diferente.


## 64. Historical Benchmark Memory
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- manter histórico de benchmarks reais de modelos, agentes, skills, tools e pipelines;
- separar resultados por domínio, projeto, versão e dificuldade;
- usar recência, sample size e confidence;
- alimentar Router, Elo e Compute Governor;
- detectar regressão de desempenho ao longo do tempo.

Observação: decisões futuras devem considerar performance observada no mundo real, não só expectativa teórica.


## 65. Self-Generated Evals
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- gerar avaliações específicas para cada missão;
- transformar requisitos e riscos em testes/evals executáveis ou verificáveis;
- criar critérios positivos e negativos;
- usar os evals para comparar soluções, modelos e agentes;
- preservar evals úteis como ativos reutilizáveis do projeto;
- integrar-se ao Requirement Council, Solution Tournament e Verification Swarm.

Observação: o sistema deve criar seus próprios testes de qualidade quando os existentes forem insuficientes.


## 66. Self-Generated Adversarial Cases
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- gerar automaticamente casos hostis, extremos e improváveis;
- atacar limites de input, ordem de eventos, concorrência, estados inválidos e ambientes adversos;
- criar casos específicos para segurança, regressão, performance e integração;
- usar resultados para fortalecer testes e verificação;
- integrar-se ao Adversarial Council, Security Council e Verification Swarm.

Observação: casos adversariais devem buscar falhas realistas e relevantes, não apenas entradas aleatórias.


## 67. Counterexample Generator
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- tentar fabricar contraexemplos concretos para hipóteses, algoritmos, invariantes e implementações;
- usar busca direcionada por edge cases e condições de falha;
- exigir reprodução quando possível;
- refutar conclusões que não sobrevivam a contraexemplos válidos;
- integrar-se ao Hypothesis Laboratory, Algorithm Council, Cognitive Cross Examination e Evidence Court.

Observação: uma hipótese forte deve sobreviver a tentativas sérias de falsificação.


## 68. Proof Obligation System
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- associar obrigações de prova a claims, decisões e condições críticas;
- exigir evidência mínima antes de aceitar afirmações importantes;
- vincular cada proof obligation a source, test, evidence level e status;
- bloquear conclusão quando obrigações críticas permanecerem abertas;
- integrar-se ao Evidence Court, Requirement Council e Final Completion Tribunal.

Observação: claims críticos não devem ser aceitos apenas por confiança do agente.


## 69. Self-Evolving Router
**Status:** APROVADA

Decisão: entra na futura GAU v5.

Funções previstas:
- fazer o roteador aprender continuamente qual combinação Model × Agent × Skill × Tool × Cognitive Style × Council × Workflow funciona melhor;
- usar Model Elo, Agent Elo, Skill Elo, Tool Elo, Pipeline Elo, benchmarks históricos e resultados reais;
- adaptar políticas de roteamento por domínio, projeto e tipo de missão;
- detectar degradação de combinações antes consideradas fortes;
- explorar alternativas com cautela para continuar aprendendo;
- atualizar recomendações sem tratar tier, nome ou popularidade como prova de qualidade;
- manter Gemini 3.8 Flash como workhorse principal enquanto o histórico real sustentar essa posição;
- integrar-se ao Adaptive Model Router 3.0, Meta-Orchestrator e Compute Governor.

Observação: o Router deve evoluir com evidência acumulada, sem overfitting nem mudanças bruscas por amostras pequenas.
