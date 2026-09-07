---
name: gau-27-ux-council
description: Avaliar interface por jornadas, acessibilidade e estados reais no navegador. Integra a ideia 27 do GAU v5.
---

# UX Council

## 1. Entrada e Ativação

- **Gatilho**: Avaliar interface por jornadas, acessibilidade e estados reais no navegador.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `ux`.

## 2. Procedimento Operacional Específico

- usar 6 especialistas de UX + 1 UX Judge;
- avaliar clareza da interface, fluxo do usuário, acessibilidade, consistência, estados de erro/vazio e carga cognitiva;
- executar User Journey Attack com perfis e cenários distintos;
- detectar regressões de experiência mesmo quando testes técnicos estiverem verdes;
- usar UX Regression Guard em mudanças de interface;
- aproveitar browser/runtime real quando disponível para validar comportamento de verdade;
- ser acionado apenas quando houver impacto real na experiência do usuário;
- integrar-se ao Coding Swarm, Verification Swarm e Supreme Judge Council.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . attest`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/ux.json`.
   - Registre: `mission`, `idea_id` (27), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `ux.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
