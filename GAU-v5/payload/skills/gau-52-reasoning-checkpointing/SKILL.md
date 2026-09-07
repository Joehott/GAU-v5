---
name: gau-52-reasoning-checkpointing
description: Preservar fatos, decisões, hipóteses, pendências e próximos passos para retomada. Integra a ideia 52 do GAU v5.
---

# Reasoning Checkpointing

## 1. Entrada e Ativação

- **Gatilho**: Preservar fatos, decisões, hipóteses, pendências e próximos passos para retomada.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `checkpoint`.

## 2. Procedimento Operacional Específico

- criar checkpoints estruturados do estado cognitivo da missão;
- registrar goal_state, requirements, known_facts, assumptions, hypotheses, rejected_paths, decisions, evidence, open_questions, risks, current_plan, next_actions e code_checkpoint;
- usar validadores especializados para fatos, hipóteses, evidências, decisões, riscos e continuidade;
- permitir branching de raciocínio para estratégias concorrentes;
- permitir Cognitive Rollback quando uma premissa posterior for refutada;
- vincular checkpoints a commit, hashes/arquivos, versão do Project Brain e versão do Semantic Code Graph;
- marcar checkpoints como parcialmente STALE quando mudanças relevantes invalidarem parte do conhecimento;
- integrar-se ao Hypothesis Laboratory, Solution Tournament, Parallel Worktree Swarm, Replanning e Verification.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . checkpoint`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/checkpoint.json`.
   - Registre: `mission`, `idea_id` (52), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `checkpoint.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
