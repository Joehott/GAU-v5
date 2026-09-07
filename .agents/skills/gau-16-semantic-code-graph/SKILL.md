---
name: gau-16-semantic-code-graph
description: Mapear relações comprovadas de chamadas, dados, eventos e contratos. Integra a ideia 16 do GAU v5.
---

# Semantic Code Graph

## 1. Entrada e Ativação

- **Gatilho**: Mapear relações comprovadas de chamadas, dados, eventos e contratos.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `semantic-graph`.

## 2. Procedimento Operacional Específico

- representar semanticamente como o projeto se conecta, além de simples imports e estrutura de pastas;
- mapear call graph, fluxo de dados, contratos/interfaces, testes, runtime, eventos, configurações e dependências indiretas;
- usar 6+ cérebros especializados para construir e validar diferentes camadas do grafo;
- associar cada relação a `relation_type`, `source`, `target`, `confidence`, `evidence` e `last_verified`;
- calcular blast radius de mudanças e ajudar a prever regressões;
- detectar módulos órfãos, dependências escondidas e fluxos críticos;
- atualizar o grafo de forma incremental conforme o código muda;
- integrar-se ao Project Brain e ao futuro Context Compiler.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . graph-add`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/semantic-graph.json`.
   - Registre: `mission`, `idea_id` (16), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `semantic-graph.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
