---
name: gau-39-meta-orchestrator
description: Escolher etapas, responsáveis e dependências de uma missão. Integra a ideia 39 do GAU v5.
---

# Meta-Orchestrator

## 1. Entrada e Ativação

- **Gatilho**: Escolher etapas, responsáveis e dependências de uma missão.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `orchestration-dag`.

## 2. Procedimento Operacional Específico

- operar acima de agentes, councils, swarms e routers;
- escolher a arquitetura cognitiva completa de cada missão;
- decidir pipeline, ordem das etapas, councils necessários, paralelismo, checkpoints e pontos de consenso;
- usar um Orchestration Council com 6 cérebros + 1 Meta Judge quando a missão justificar;
- representar a missão como um Cognitive DAG;
- permitir Pipeline Mutation quando novas evidências mudarem as necessidades da missão;
- manter Orchestration Memory e ranking histórico de workflows/pipelines;
- obedecer ao Compute Governor para evitar ativação excessiva;
- integrar-se ao Requirement Council, Adaptive Router, Replanning e Final Completion Tribunal.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . task-add`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/orchestration-dag.json`.
   - Registre: `mission`, `idea_id` (39), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `orchestration-dag.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
