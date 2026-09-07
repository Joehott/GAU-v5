---
name: gau-20-uncertainty-council
description: Separar suposições de fatos e identificar testes que reduzem incerteza. Integra a ideia 20 do GAU v5.
---

# Uncertainty Council

## 1. Entrada e Ativação

- **Gatilho**: Separar suposições de fatos e identificar testes que reduzem incerteza.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `uncertainty`.

## 2. Procedimento Operacional Específico

- usar pelo menos 6 analistas independentes + 1 Uncertainty Judge opcional;
- medir certeza factual, clareza de requisitos, certeza de causa raiz, certeza da solução, risco de regressão e evidência faltante;
- manter um Assumption Registry para registrar suposições importantes, confiança, impacto se estiverem erradas e evidência disponível;
- aplicar a regra `confidence cannot exceed evidence quality`;
- usar um Counterfactual Analyst para testar cenários em que a hipótese principal esteja errada;
- escalar automaticamente o número de cérebros conforme a incerteza;
- acionar Reasoning Ensemble, Hypothesis Laboratory e councils quando a incerteza justificar;
- integrar-se diretamente ao Adaptive Model Router 3.0 e ao `/goal`.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . record --kind assumption`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/uncertainty.json`.
   - Registre: `mission`, `idea_id` (20), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `uncertainty.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
