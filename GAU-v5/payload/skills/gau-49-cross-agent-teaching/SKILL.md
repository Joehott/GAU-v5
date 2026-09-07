---
name: gau-49-cross-agent-teaching
description: Transmitir descoberta validada e verificar compreensão pela aplicação. Integra a ideia 49 do GAU v5.
---

# Cross-Agent Teaching

## 1. Entrada e Ativação

- **Gatilho**: Transmitir descoberta validada e verificar compreensão pela aplicação.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `teach-back`.

## 2. Procedimento Operacional Específico

- permitir que agentes especializados ensinem descobertas verificadas a outros agentes sem retransmitir contexto bruto;
- criar lições rastreáveis com fato, evidência, aplicabilidade, confiança e fonte original;
- usar Evidence Check antes da propagação;
- usar Teach-Back para verificar se o conhecimento foi compreendido corretamente;
- distribuir cada lição apenas aos agentes que realmente precisam dela;
- manter Lesson Library separada em Mission Lessons, Project Lessons e Reusable Lessons;
- impedir telefone sem fio, mantendo referência à evidência original;
- aprender por histórico quais agentes ensinam e assimilam melhor cada tipo de conhecimento;
- integrar-se ao Knowledge Decomposition, Project Brain, Context Compiler e Recursive Intelligence.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . record --kind lesson`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/teach-back.json`.
   - Registre: `mission`, `idea_id` (49), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `teach-back.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
