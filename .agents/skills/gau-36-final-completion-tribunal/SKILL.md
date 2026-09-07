---
name: gau-36-final-completion-tribunal
description: Encerrar missão somente com requisitos cobertos e pendências críticas resolvidas. Integra a ideia 36 do GAU v5.
---

# Final Completion Tribunal

## 1. Entrada e Ativação

- **Gatilho**: Encerrar missão somente com requisitos cobertos e pendências críticas resolvidas.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `completion-proof`.

## 2. Procedimento Operacional Específico

- usar 6 auditores especializados + 1 Completion Judge;
- verificar requisitos, testes, regressões, riscos, evidências e escopo antes de encerrar `/goal`;
- usar estados COMPLETE, COMPLETE_WITH_KNOWN_RISKS, INCOMPLETE, BLOCKED_EXTERNALLY e REOPEN_REQUIRED;
- gerar Completion Proof com cobertura de requisitos, testes críticos, regressões, findings abertos, freshness das evidências, assumptions e blockers;
- impedir maioria/média de esconder falhas críticas;
- gerar Goal Closure Checklist dinâmica conforme o tipo de tarefa;
- reabrir automaticamente a missão quando houver falha crítica válida;
- integrar-se a todos os councils, swarms, Evidence Court e Verification Swarm.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . close`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/completion-proof.json`.
   - Registre: `mission`, `idea_id` (36), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `completion-proof.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
