---
name: gau-30-requirement-council
description: Transformar pedido em baseline de requisitos verificáveis sem ampliar escopo. Integra a ideia 30 do GAU v5.
---

# Requirement Council

## 1. Entrada e Ativação

- **Gatilho**: Transformar pedido em baseline de requisitos verificáveis sem ampliar escopo.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `requirements`.

## 2. Procedimento Operacional Específico

- usar 6 analistas de requisitos + 1 Requirement Judge;
- separar requisitos literais, restrições implícitas, critérios de aceitação, edge cases, conflitos e controle de escopo;
- gerar uma Requirement Baseline versionada para cada missão relevante;
- detectar Requirement Drift durante a execução;
- permitir evolução controlada por Requirement Change Proposal + análise de impacto;
- manter Traceability Matrix ligando requisito → arquitetura → arquivos → implementação → testes → evidência;
- impedir que o sistema invente escopo extra ou deixe requisitos importantes sem cobertura;
- integrar-se ao Architecture Council, Coding Swarm, Verification Swarm e `/goal`.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . new`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/requirements.json`.
   - Registre: `mission`, `idea_id` (30), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `requirements.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
