---
name: gau-43-cognitive-cross-examination
description: Interrogar premissas com previsões testáveis e contraexemplos. Integra a ideia 43 do GAU v5.
---

# Cognitive Cross Examination

## 1. Entrada e Ativação

- **Gatilho**: Interrogar premissas com previsões testáveis e contraexemplos.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `cross-examination`.

## 2. Procedimento Operacional Específico

- usar 6 examinadores especializados + 1 Cross-Examination Judge;
- questionar premissas, evidências, lógica, contraexemplos, explicações alternativas e escopo;
- exigir previsões testáveis para hipóteses importantes;
- manter rodadas limitadas de apresentação, perguntas, respostas com evidência e contraexemplos;
- preservar Minority Protection quando um desafio relevante não for respondido;
- registrar Surviving Claims que resistirem ao interrogatório;
- integrar-se ao Reasoning Ensemble, Contradiction Detector, Evidence Court, Weighted Consensus e Supreme Judge Council;
- usar o Compute Governor para limitar rodadas e custo.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . record --kind claim`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/cross-examination.json`.
   - Registre: `mission`, `idea_id` (43), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `cross-examination.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
