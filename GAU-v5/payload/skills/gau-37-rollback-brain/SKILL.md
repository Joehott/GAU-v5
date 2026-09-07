---
name: gau-37-rollback-brain
description: Recuperar estado da missão e planejar reversão seletiva do código. Integra a ideia 37 do GAU v5.
---

# Rollback Brain

## 1. Entrada e Ativação

- **Gatilho**: Recuperar estado da missão e planejar reversão seletiva do código.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `recovery-plan`.

## 2. Procedimento Operacional Específico

- usar 6 cérebros especializados + 1 Rollback Judge;
- suportar Local Rollback, Branch Rollback e Mission Rollback;
- identificar quais mudanças realmente causaram a falha;
- preservar alterações boas e reverter apenas o que for necessário;
- executar Rollback Safety Check para banco, migrations, arquivos, APIs, contratos, caches, filas e side effects;
- gerar Recovery Plan após a reversão;
- registrar Failure Memory com strategy, failure_reason, evidence, affected_files, checkpoint, reverted_changes, preserved_changes e lessons;
- integrar-se ao Loop Breaker Council, Automatic Replanning Council, Project Brain, Parallel Worktree Swarm e Final Completion Tribunal.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . restore-checkpoint`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/recovery-plan.json`.
   - Registre: `mission`, `idea_id` (37), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `recovery-plan.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
