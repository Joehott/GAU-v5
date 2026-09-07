---
name: gau-44-same-model-diversity
description: Usar sessões isoladas do modelo disponível com perspectivas diferentes. Integra a ideia 44 do GAU v5.
---

# Same-Model Diversity

## 1. Entrada e Ativação

- **Gatilho**: Usar sessões isoladas do modelo disponível com perspectivas diferentes.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `same-model-diversity`.

## 2. Procedimento Operacional Específico

- usar 6+ execuções independentes do mesmo modelo quando isso for mais forte ou mais disponível que misturar modelos inferiores;
- permitir múltiplas instâncias do Gemini 3.8 Flash como base de councils e ensembles;
- aplicar estilos cognitivos diferentes entre instâncias;
- manter isolamento inicial para evitar efeito manada;
- executar fases independent reasoning → compare → challenge → synthesis;
- calcular Reasoning Correlation / Cognitive Diversity para medir diversidade real;
- adicionar outros modelos apenas quando a diversidade ou a especialização exigir;
- integrar-se ao Compute Governor, Model Elo, Cognitive Specialization, Cognitive Cross Examination, Evidence Court e Weighted Consensus.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . consensus`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/same-model-diversity.json`.
   - Registre: `mission`, `idea_id` (44), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `same-model-diversity.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
