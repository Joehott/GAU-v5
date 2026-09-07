---
name: gau-45-intelligence-tournament-bracket
description: Comparar candidatos por chaves, registrando porque cada um avançou. Integra a ideia 45 do GAU v5.
---

# Intelligence Tournament Bracket

## 1. Entrada e Ativação

- **Gatilho**: Comparar candidatos por chaves, registrando porque cada um avançou.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `tournament-bracket`.

## 2. Procedimento Operacional Específico

- comparar 6–16 cérebros em formato de torneio por chaves;
- aplicar o torneio a linhas de raciocínio, planos, hipóteses e estratégias, não apenas implementações;
- avaliar cada duelo por evidência, correção, requisitos, contraexemplos, simplicidade, riscos e consistência;
- usar Elo apenas para seeding, nunca como decisão automática do vencedor;
- aplicar a regra `Evidence beats ranking`;
- usar Winner Inheritance para preservar contribuições úteis de soluções eliminadas;
- permitir preliminares, quartas, semifinais e final conforme o número de cérebros;
- integrar-se ao Solution Tournament, Reasoning Ensemble, Weighted Consensus e Compute Governor.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . match`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/tournament-bracket.json`.
   - Registre: `mission`, `idea_id` (45), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `tournament-bracket.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
