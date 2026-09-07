---
name: gau-06-hypothesis-laboratory
description: Investigar bug sem causa clara por testes discriminatórios. Integra a ideia 6 do GAU v5.
---

# Hypothesis Laboratory

## 1. Entrada e Ativação

- **Gatilho**: Investigar bug sem causa clara por testes discriminatórios.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `hypotheses`.

## 2. Procedimento Operacional Específico

- manter 6–8 hipóteses concorrentes para bugs difíceis e problemas sem causa clara;
- permitir expansão para 8–10 hipóteses em cenários extremamente nebulosos;
- atribuir cérebros independentes a linhas de investigação diferentes;
- registrar evidências a favor e contra, confiança atual, teste discriminatório e resultado;
- eliminar hipóteses fracas progressivamente e preservar hipóteses minoritárias até haver evidência suficiente;
- usar um Hypothesis Judge para comparar evidências e selecionar a causa mais provável;
- integrar-se ao Adversarial Council e ao Solution Tournament após a hipótese vencedora;
- ser acionado pelo Adaptive Model Router 3.0 apenas quando a incerteza justificar o custo.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . record --kind hypothesis`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/hypotheses.json`.
   - Registre: `mission`, `idea_id` (6), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `hypotheses.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
