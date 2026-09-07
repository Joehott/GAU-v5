---
name: gau-29-integration-council
description: Testar fronteiras, contratos, retries, duplicação e compatibilidade de serviços. Integra a ideia 29 do GAU v5.
---

# Integration Council

## 1. Entrada e Ativação

- **Gatilho**: Testar fronteiras, contratos, retries, duplicação e compatibilidade de serviços.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `integration`.

## 2. Procedimento Operacional Específico

- usar 6 especialistas de integração + 1 Integration Judge;
- cobrir contratos de API, contratos de dados, interação entre serviços, dependências externas, ambientes e propagação de falhas;
- gerar Contract Matrix com producer, consumer, schema/version, assumptions, error behavior, timeout, retry policy, compatibility e tests;
- gerar Compatibility Matrix entre versões de frontend, backend, banco, serviços e demais componentes;
- executar testes de falha nas fronteiras do sistema, como retries, duplicação, timeouts, serviços indisponíveis e versões incompatíveis;
- exigir evidências de integração por contract tests, integration tests, runtime traces, realistic fixtures, E2E e sandbox APIs quando disponíveis;
- integrar-se ao Semantic Code Graph, Database Council, Security Council, Performance Council e Verification Swarm.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . verify`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/integration.json`.
   - Registre: `mission`, `idea_id` (29), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `integration.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
