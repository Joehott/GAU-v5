---
name: gau-41-recursive-intelligence
description: Delegar investigação hierárquica com pai, ganho esperado e limite de profundidade. Integra a ideia 41 do GAU v5.
---

# Recursive Intelligence

## 1. Entrada e Ativação

- **Gatilho**: Delegar investigação hierárquica com pai, ganho esperado e limite de profundidade.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `recursive-delegation`.

## 2. Procedimento Operacional Específico

- usar 6 cérebros principais com capacidade de criar subcérebros temporários sob demanda;
- permitir raciocínio hierárquico em múltiplos níveis;
- exigir que cada subcérebro declare question, expected_information_gain, budget, parent e stop_condition;
- limitar `max_depth`, `max_children`, brain budget, time budget e evidence threshold;
- evitar comunicação irrestrita entre todos os ramos, usando síntese por pai/orquestrador;
- permitir Minority Escalation quando um subcérebro encontrar evidência forte contra a hipótese do pai;
- integrar-se ao Supreme Orchestrator, Meta-Orchestrator, Compute Governor e Evidence Court;
- ser reservado para tarefas COUNCIL/SWARM ou problemas realmente complexos.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . reserve`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/recursive-delegation.json`.
   - Registre: `mission`, `idea_id` (41), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `recursive-delegation.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
