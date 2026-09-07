---
name: gau-34-parallel-worktree-swarm
description: Isolar trabalhos paralelos e ordenar integração pelas dependências. Integra a ideia 34 do GAU v5.
---

# Parallel Worktree Swarm

## 1. Entrada e Ativação

- **Gatilho**: Isolar trabalhos paralelos e ordenar integração pelas dependências.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `worktree-swarm`.

## 2. Procedimento Operacional Específico

- usar 6+ worktrees isolados, cada um com branch, contexto e estado próprios;
- suportar modos Competitive Worktrees, Parallel Feature Worktrees e Experimental Worktrees;
- permitir que soluções concorrentes alterem inclusive os mesmos arquivos sem contaminar a branch principal;
- criar checkpoints/snapshots automáticos para rollback rápido;
- calcular Merge Readiness Score com testes, build, regressões, segurança, performance, compatibilidade, conflitos e cobertura de requisitos;
- impedir que score alto esconda falhas críticas;
- calcular Smart Merge Order com base em dependências;
- usar normalmente 6 workers + 1 Worktree Coordinator + 1 Integration Brain, podendo escalar para 8–12 worktrees;
- integrar-se ao Coding Swarm, Solution Tournament, Integration Council e Verification Swarm.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . worktree`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/worktree-swarm.json`.
   - Registre: `mission`, `idea_id` (34), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `worktree-swarm.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
