---
name: gau-40-supreme-orchestrator
description: Coordenar várias frentes grandes com prioridades e bloqueios. Integra a ideia 40 do GAU v5.
---

# Supreme Orchestrator

## 1. Entrada e Ativação

- **Gatilho**: Coordenar várias frentes grandes com prioridades e bloqueios.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `global-mission`.

## 2. Procedimento Operacional Específico

- operar acima de múltiplos Meta-Orchestrators em missões enormes;
- usar 6 cérebros executivos + 1 Supreme Judge;
- manter Global Mission Graph com status, owner, dependencies, risk, confidence, evidence, progress, blockers e compute_used;
- redistribuir dinamicamente cérebros e compute entre frentes conforme prioridade e risco;
- resolver conflitos entre councils por revisão cruzada de evidências;
- acompanhar Mission Health global;
- pausar frentes bloqueadas e realocar recursos para gargalos reais;
- ser reservado para missões EXPERT/COUNCIL/SWARM e projetos multifase;
- integrar-se ao Meta-Orchestrator, Compute Governor, Adaptive Router, councils, swarms e Final Completion Tribunal.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . task-add`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/global-mission.json`.
   - Registre: `mission`, `idea_id` (40), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `global-mission.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
