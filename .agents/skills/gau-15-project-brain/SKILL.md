---
name: gau-15-project-brain
description: Registrar fatos estáveis, conhecimento da missão e histórico com fontes. Integra a ideia 15 do GAU v5.
---

# Project Brain

## 1. Entrada e Ativação

- **Gatilho**: Registrar fatos estáveis, conhecimento da missão e histórico com fontes.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `project-memory`.

## 2. Procedimento Operacional Específico

- manter memória estruturada e consultável do projeto;
- separar Stable Knowledge, Mission Knowledge e Historical Knowledge;
- registrar arquitetura, módulos, símbolos, dependências, contratos, testes, decisões, bugs conhecidos, restrições e histórico;
- permitir que múltiplos cérebros consultem recortes diferentes da mesma base;
- atualizar o conhecimento conforme novas descobertas surgirem durante `/goal`;
- associar memória a `source`, `last_verified`, `confidence` e arquivos afetados;
- marcar conhecimento como `STALE` quando mudanças no código puderem invalidá-lo;
- reduzir releitura desnecessária e melhorar tarefas long-horizon;
- integrar-se ao Adaptive Router, Reasoning Ensemble, Architecture Council, Coding Swarm e Verification Swarm.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . record --kind fact`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/project-memory.json`.
   - Registre: `mission`, `idea_id` (15), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `project-memory.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
