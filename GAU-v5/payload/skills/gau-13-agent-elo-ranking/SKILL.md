---
name: gau-13-agent-elo-ranking
description: Atribuir crédito a agentes pela contribuição comprovada. Integra a ideia 13 do GAU v5.
---

# Agent Elo Ranking

## 1. Entrada e Ativação

- **Gatilho**: Atribuir crédito a agentes pela contribuição comprovada.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `agent-elo`.

## 2. Procedimento Operacional Específico

- manter Elo separado por agente e por domínio/tipo de tarefa;
- medir desempenho real de debugger, architect, repo-scout, frontend-specialist, deep-reasoner e demais agentes;
- manter também combinações Agent × Model, permitindo descobrir qual cérebro funciona melhor com qual agente;
- usar atribuição de crédito baseada em evidência, sem premiar automaticamente todos os agentes presentes;
- considerar contribuição real para descoberta, correção, regressão evitada, solução vencedora e verificação;
- alimentar o Adaptive Model Router 3.0 e o roteador de agentes;
- usar tamanho mínimo de amostra, confiança estatística e decay temporal.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . match`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/agent-elo.json`.
   - Registre: `mission`, `idea_id` (13), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `agent-elo.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
