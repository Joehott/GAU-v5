---
name: gau-38-compute-governor
description: Reservar capacidade antes de criar agente e liberar quando encerrar. Integra a ideia 38 do GAU v5.
---

# Compute Governor

## 1. Entrada e Ativação

- **Gatilho**: Reservar capacidade antes de criar agente e liberar quando encerrar.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `compute-budget`.

## 2. Procedimento Operacional Específico

- controlar orçamento de inteligência por missão;
- decidir número de cérebros, modelos, contexto, tool calls e rodadas de debate;
- usar níveis FAST, SMART, DEEP, EXPERT, COUNCIL e SWARM;
- adaptar dinamicamente o tamanho de councils e swarms conforme dificuldade, incerteza, risco, valor esperado, custo e lacuna de evidência;
- suportar escalada e de-escalada automática;
- aplicar `Stop When Proven` para evitar compute ornamental;
- manter soft limits e hard limits para brain budget, token budget, tool-call budget, debate-round budget e time budget;
- usar Model Elo, Agent Elo, Skill Elo e Tool Elo para compor equipes eficientes;
- tratar Gemini 3.8 Flash como workhorse principal por padrão, sem promover automaticamente para Pro.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . reserve`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/compute-budget.json`.
   - Registre: `mission`, `idea_id` (38), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `compute-budget.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
