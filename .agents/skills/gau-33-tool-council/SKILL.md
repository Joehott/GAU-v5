---
name: gau-33-tool-council
description: Escolher ferramenta disponível pelo resultado esperado e definir fallback. Integra a ideia 33 do GAU v5.
---

# Tool Council

## 1. Entrada e Ativação

- **Gatilho**: Escolher ferramenta disponível pelo resultado esperado e definir fallback.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `tool-plan`.

## 2. Procedimento Operacional Específico

- usar 6 especialistas de ferramentas + 1 Tool Judge;
- cobrir descoberta de ferramentas, capability matching, confiabilidade, custo/latência, risco e fallback;
- gerar Tool Plan com tool, purpose, expected_output, fallback, risk e success_criteria;
- escolher não apenas a ferramenta, mas também a melhor sequência de uso;
- manter Tool Elo por tipo de tarefa e por combinação Agent × Model × Tool;
- registrar falhas de ferramentas e usar esse histórico para melhorar futuras escolhas;
- impedir tool calls sem ganho claro de informação ou capacidade de execução;
- integrar-se ao Adaptive Model Router 3.0, Context Compiler e `/goal`.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . record --kind decision`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/tool-plan.json`.
   - Registre: `mission`, `idea_id` (33), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `tool-plan.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
