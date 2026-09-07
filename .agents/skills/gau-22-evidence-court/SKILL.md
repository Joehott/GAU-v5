---
name: gau-22-evidence-court
description: Vincular conclusão relevante à reprodução e proveniência verificáveis. Integra a ideia 22 do GAU v5.
---

# Evidence Court

## 1. Entrada e Ativação

- **Gatilho**: Vincular conclusão relevante à reprodução e proveniência verificáveis.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `evidence-chain`.

## 2. Procedimento Operacional Específico

- usar 6 investigadores especializados + 1 Evidence Judge opcional;
- exigir evidência verificável para conclusões importantes;
- usar papéis como Evidence Collector, Evidence Challenger, Reproduction Agent, Counterexample Hunter, Source/Provenance Auditor e Alternative Explanation Brain;
- classificar força de evidência em níveis E0–E5;
- exigir níveis mínimos de evidência conforme risco e impacto da tarefa;
- manter Evidence Chain com claim, evidence, source, test, result, timestamp e code checkpoint;
- invalidar evidências que ficarem obsoletas após mudanças relevantes no código;
- aplicar a regra `Evidence beats vote`;
- integrar-se ao Hypothesis Laboratory, Weighted Consensus, Contradiction Detector, Verification Swarm e Supreme Judge Council.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . verify`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/evidence-chain.json`.
   - Registre: `mission`, `idea_id` (22), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `evidence-chain.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
