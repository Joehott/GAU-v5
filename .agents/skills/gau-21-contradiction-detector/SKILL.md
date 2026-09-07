---
name: gau-21-contradiction-detector
description: Conciliar afirmações considerando versão, ambiente, escopo e evidência. Integra a ideia 21 do GAU v5.
---

# Contradiction Detector

## 1. Entrada e Ativação

- **Gatilho**: Conciliar afirmações considerando versão, ambiente, escopo e evidência.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `contradictions`.

## 2. Procedimento Operacional Específico

- usar 6 scanners especializados + 1 Contradiction Judge;
- detectar conflitos entre agentes, memória, código, requisitos, testes, evidências e planos;
- diferenciar contradição real de diferença de escopo, versão, ambiente, branch ou momento;
- manter um Contradiction Graph com relações como `contradicts` e `supersedes`;
- associar afirmações a `source`, `timestamp`, `scope`, `confidence` e `evidence`;
- bloquear `/goal` quando houver conflito crítico não resolvido;
- focar debates apenas nos pontos onde existe desacordo relevante;
- integrar-se ao Project Brain, Semantic Code Graph, Memory Jury, Reasoning Ensemble e councils.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . record --kind contradiction`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/contradictions.json`.
   - Registre: `mission`, `idea_id` (21), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `contradictions.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
