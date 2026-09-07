---
name: gau-07-architecture-council
description: Escolher arquitetura com impacto amplo e comparar migração e manutenção. Integra a ideia 7 do GAU v5.
---

# Architecture Council

## 1. Entrada e Ativação

- **Gatilho**: Escolher arquitetura com impacto amplo e comparar migração e manutenção.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `architecture`.

## 2. Procedimento Operacional Específico

- usar 6 arquitetos especializados + 1 Architecture Judge em decisões de impacto amplo;
- avaliar simplicidade, escalabilidade, segurança, performance, manutenção, compatibilidade/migração e custo operacional;
- exigir comparação explícita de benefícios, custos, riscos, blast radius, migração, rollback, testabilidade e compatibilidade;
- impedir vitória por votação simples sem justificativa técnica;
- registrar por que a arquitetura vencedora foi escolhida e por que as alternativas perderam;
- integrar-se ao Multi-Model Debate, Adversarial Council e Supreme Judge Council em decisões críticas;
- ser acionado pelo Adaptive Model Router 3.0 apenas quando a mudança tiver impacto arquitetural real.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . record --kind decision`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/architecture.json`.
   - Registre: `mission`, `idea_id` (7), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `architecture.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
