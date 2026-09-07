---
name: gau-19-automatic-replanning-council
description: Mudar o plano por nova evidência sem perder os requisitos. Integra a ideia 19 do GAU v5.
---

# Automatic Replanning Council

## 1. Entrada e Ativação

- **Gatilho**: Mudar o plano por nova evidência sem perder os requisitos.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `replan`.

## 2. Procedimento Operacional Específico

- usar 6 planejadores especializados + 1 Replanning Judge;
- detectar quando o plano original deixou de ser adequado por nova evidência, bloqueios, falhas, regressões, dependências ou loops;
- suportar Local Replan, Branch Replan e Mission Replan;
- registrar por que o plano mudou, qual evidência motivou a mudança, o que foi preservado, o que foi abandonado, checkpoint usado e novos riscos;
- recalcular dependências e DAG quando necessário;
- usar um Goal Guardian para garantir que o novo plano ainda atende ao objetivo original;
- detectar ciclos de planejamento e impedir alternância infinita entre estratégias já falhas;
- exigir estratégia estruturalmente diferente quando houver loop;
- integrar-se ao `/goal`, Project Brain, Coding Swarm e Verification Swarm.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . record --kind decision`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/replan.json`.
   - Registre: `mission`, `idea_id` (19), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `replan.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
