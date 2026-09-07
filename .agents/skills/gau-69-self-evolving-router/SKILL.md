---
name: gau-69-self-evolving-router
description: Usar histórico contextual para recomendar combinações sem promover por nome/tier. Integra a ideia 69 do GAU v5.
---

# Self-Evolving Router

## 1. Entrada e Ativação

- **Gatilho**: Usar histórico contextual para recomendar combinações sem promover por nome/tier.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `evolving-router`.

## 2. Procedimento Operacional Específico

- fazer o roteador aprender continuamente qual combinação Model × Agent × Skill × Tool × Cognitive Style × Council × Workflow funciona melhor;
- usar Model Elo, Agent Elo, Skill Elo, Tool Elo, Pipeline Elo, benchmarks históricos e resultados reais;
- adaptar políticas de roteamento por domínio, projeto e tipo de missão;
- detectar degradação de combinações antes consideradas fortes;
- explorar alternativas com cautela para continuar aprendendo;
- atualizar recomendações sem tratar tier, nome ou popularidade como prova de qualidade;
- manter Gemini 3.8 Flash como workhorse principal enquanto o histórico real sustentar essa posição;
- integrar-se ao Adaptive Model Router 3.0, Meta-Orchestrator e Compute Governor.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . route`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/evolving-router.json`.
   - Registre: `mission`, `idea_id` (69), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `evolving-router.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
