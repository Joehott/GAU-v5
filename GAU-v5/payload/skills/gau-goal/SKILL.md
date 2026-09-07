---
name: gau-goal
description: Integra GAU v5 em tarefas de engenharia e /goal, com seleção de skills, agentes, checkpoints e provas de conclusão.
---
# Integração com /goal

1. Ler `.gau/docs/OPERACAO.md`. Executar `python .gau/runtime/gau.py doctor`.
   No Windows, usar `py -3` se `python` não existir. Abrir `.gau/config.json`.
2. Preservar o pedido e criar baseline em `.gau/missions/<nome>/mission.json`
   usando o exemplo. Incluir todos os requisitos concretos e critérios de prova.
   Executar `new --spec <arquivo>` e guardar o ID retornado; retomar ID existente.
3. Descobrir capacidades reais do host. Verificar se `invoke_subagent` existe e
   quais modelos/tiers podem ser selecionados. Preencher route.json com a disponibilidade
   observada; nunca inferir uma API pelo nome comercial. O modelo principal preferido
   é o Flash escolhido pelo usuário; `inherit` mantém a seleção corrente.
4. Executar `route <id> --spec <arquivo>`. Consultar `.gau/registry.json` e ler
   as skills correspondentes aos IDs escolhidos, acrescentando as necessárias
   aos requisitos concretos. As 69 ficam disponíveis; não executar todas por inércia.
5. Aplicar os procedimentos selecionados. Criar DAG e worktrees se houver trabalho
   independente. Para delegação, seguir `.gau/docs/DELEGACAO.md`: reservar, invocar,
   monitorar, recolher resultados e liberar. Usar os perfis gau-* descobertos pelo host.
6. Implementar, investigar e verificar. Registrar evidências com `verify` ou `attest`.
   Vincular cada claim crítico a obrigação de prova. Registrar falhas, suposições e
   decisões relevantes. Criar checkpoint antes de trocar estratégia, modelo ou contexto.
7. Se surgir falha, usar hipótese/novidade e replanejar. Consultar freshness após
   mudanças; repetir apenas verificações afetadas. Respeitar limites de rodadas,
   ferramentas, tempo e cérebros; não tentar contornar limitações de conta.
8. Rodar `gate <id>` e `close <id>` antes de afirmar conclusão. Resolver todos os
   bloqueios dentro do escopo. Se depender de recurso ausente, relatar BLOCKED_EXTERNALLY
   com próximo passo concreto. Só dizer COMPLETE se os critérios tiverem prova atual.
9. Fora do caminho crítico, gau-maintain registra resultados comparáveis para melhorar
   recomendações futuras. Não atribuir crédito a modelos/skills que não participaram.

Os comandos locais não interceptam o /goal nem garantem que o host siga instruções.
O teste de ativação do README é necessário para confirmar leitura e delegação na
instalação real. Se uma regra não foi descoberta, abrir esta skill explicitamente.
