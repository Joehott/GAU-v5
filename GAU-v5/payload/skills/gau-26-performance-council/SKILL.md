---
name: gau-26-performance-council
description: Medir gargalo e comparar baseline/resultado sob a mesma carga. Integra a ideia 26 do GAU v5.
---

# Performance Council

## 1. Entrada e Ativação

- **Gatilho**: Medir gargalo e comparar baseline/resultado sob a mesma carga.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `performance`.

## 2. Procedimento Operacional Específico

- usar 6 especialistas de performance + 1 Performance Judge;
- cobrir CPU, memória, I/O/rede, banco/queries, concorrência/latência e algoritmo/complexidade;
- operar em modos Bottleneck Hunt, Optimization Tournament e Regression Guard;
- exigir benchmarks e métricas antes/depois, incluindo latência, CPU, memória, throughput, queries e I/O quando aplicáveis;
- manter Performance Budgets definidos por projeto;
- bloquear regressões relevantes ou exigir justificativa explícita;
- impedir otimizações que melhorem velocidade às custas de correção, segurança, compatibilidade ou manutenção;
- integrar-se ao Coding Swarm, Solution Tournament, Verification Swarm e Evidence Court.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . verify`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/performance.json`.
   - Registre: `mission`, `idea_id` (26), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `performance.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
