---
name: gau-08-coding-swarm
description: Dividir implementação em subtarefas independentes com donos e interfaces. Integra a ideia 8 do GAU v5.
---

# Coding Swarm

## 1. Entrada e Ativação

- **Gatilho**: Dividir implementação em subtarefas independentes com donos e interfaces.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `coding-dag`.

## 2. Procedimento Operacional Específico

- usar 6 coders + 1 Integration Brain em tarefas grandes;
- oferecer modo Parallel Decomposition para subtarefas independentes;
- oferecer modo Competitive Coding para múltiplas soluções concorrentes;
- isolar cada coder em Git worktree/branch/contexto próprios;
- exigir um Dependency DAG antes de paralelizar trabalho;
- usar o Integration Brain para coordenar interfaces, merges, compatibilidade e testes integrados;
- integrar-se ao Solution Tournament em cenários competitivos;
- ser acionado pelo Adaptive Model Router 3.0 apenas quando houver paralelismo útil ou complexidade suficiente.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . task-add`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/coding-dag.json`.
   - Registre: `mission`, `idea_id` (8), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `coding-dag.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
