---
name: gau-51-failure-pattern-memory
description: Relacionar assinatura de falha à causa e à correção comprovada. Integra a ideia 51 do GAU v5.
---

# Failure Pattern Memory

## 1. Entrada e Ativação

- **Gatilho**: Relacionar assinatura de falha à causa e à correção comprovada.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `failure-pattern`.

## 2. Procedimento Operacional Específico

- manter Failure Fingerprints com assinatura do erro, subsistema, ambiente, trigger, causa raiz, estratégias falhas, correção vencedora, regressões e evidências;
- minerar padrões recorrentes entre falhas históricas;
- usar Preemptive Failure Warning antes de mudanças que coincidam com padrões perigosos conhecidos;
- transformar padrões bem confirmados em regression tests, verification rules, skills ou constraints;
- usar sample_count, confidence, last_seen, affected_versions e last_verified;
- marcar padrões como STALE quando arquitetura ou versões mudarem;
- aplicar a regra `History suggests; Evidence decides`;
- integrar-se ao Project Brain, Hypothesis Laboratory, Loop Breaker Council, Rollback Brain, Verification Swarm e Expert Spawning.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . record --kind failure`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/failure-pattern.json`.
   - Registre: `mission`, `idea_id` (51), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `failure-pattern.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
