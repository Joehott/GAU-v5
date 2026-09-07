---
name: gau-50-agent-contradiction-memory
description: Registrar objeções confirmadas e falsas por agente/domínio. Integra a ideia 50 do GAU v5.
---

# Agent Contradiction Memory

## 1. Entrada e Ativação

- **Gatilho**: Registrar objeções confirmadas e falsas por agente/domínio.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `contradiction-history`.

## 2. Procedimento Operacional Específico

- manter histórico de contradições levantadas, confirmadas e falsas por agente e por domínio;
- calcular Minority Precision para medir a qualidade histórica de objeções minoritárias;
- registrar domínio, evidência usada, impacto final e resultado da divergência;
- manter Pairwise Contradiction History para pares de agentes que discordam com frequência;
- usar reputação de contradição apenas para priorizar investigação, nunca como prova de verdade;
- aplicar a regra `Evidence beats reputation`;
- integrar-se ao Contradiction Detector, Weighted Consensus, Minority Protection, Evidence Court, Agent Elo, Meta-Orchestrator e Dynamic Council Size.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . record --kind contradiction`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/contradiction-history.json`.
   - Registre: `mission`, `idea_id` (50), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `contradiction-history.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
