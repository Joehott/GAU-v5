# Delegação real no Antigravity

1. Confirmar ferramenta nativa `invoke_subagent` e descoberta de perfis `gau-*`.
   Usar a assinatura fornecida pelo host: não inventar nomes de parâmetros. Perfis
   são arquivos em `.agents/agents` com model inherit, permissões sandbox e ferramentas
   documentadas. Confirmar os nomes de tools na versão instalada.
2. Dimensionar pelo route e pela capacidade real. Antes de cada spawn, usar reserve
   com parent, question, expected_gain, stop_condition e orçamento. Se a reserva
   falhar, não criar a sessão. Operar em ondas para respeitar o teto.
3. Para implementações concorrentes, criar worktree. Para revisão, fornecer o
   checkpoint exato (inclusive alterações relevantes não commitadas) em workspace
   com acesso de leitura apropriado. Verificação de branch errada não comprova entrega.
4. Enviar mission ID, tarefa delimitada, arquivos permitidos, dependências, caminhos
   de saída exclusivos, critérios e tempo. Não compartilhar conclusões antes de
   terminar a primeira rodada independente. Modelo herdado mantém escolha atual;
   o tier flash pode não identificar versão comercial fixa. A seleção deve ser
   feita com capacidades que o host realmente expõe.
5. Acompanhar sessões. Não confundir reserva, arquivo de perfil ou função no prompt
   com sessão ativa. Registrar ID real e modelo efetivo. Cancelar via ferramenta
   nativa quando orçamento vencer; liberar a reserva no runtime após encerrar.
6. Recolher os resultados e registrar evidências. Comparar apenas depois da coleta.
   O juiz recebe requisitos, provas e pareceres independentes. Rodadas adicionais
   precisam de questão nova, prova nova ou contraexemplo relevante. Máximo padrão 3.
7. Achado crítico válido veta conclusão; minoria apoiada por prova recebe teste
   adicional. Integrar somente soluções que atendam critérios e dependências.
8. Se ferramenta/modelo/skill não estiver disponível, registrar bloqueio real.
   A alternativa sequencial é permitida em trabalho sem independência obrigatória,
   com estado SERIAL_LIMITED. Não chamar isso de seis cérebros independentes.

## Composição sugerida por conselho

| Conselho | Seis perspectivas possíveis | Síntese |
|---|---|---|
| Final/verificação | requisito, funcional, regressão, segurança, performance, integração | gau-judge |
| Arquitetura | simplicidade, escala, segurança, custo, migração, manutenção | gau-architect/gau-judge |
| Hipóteses | causal, contrafactual, reprodução, dados, runtime, evidência | gau-investigator/gau-judge |
| Segurança | autenticação, entrada, segredos, dependências, privacidade, runtime | gau-security/gau-judge |
| Performance | CPU, memória, rede, banco, concorrência, algoritmo | gau-performance/gau-judge |
| UX | clareza, jornada, acessibilidade, consistência, estados, esforço cognitivo | gau-ux/gau-judge |

Um perfil pode ser reutilizado em sessões independentes com perguntas/perspectivas
específicas. Nunca contar coordenador e juiz como gratuitos fora do orçamento.
Para especialistas temporários, `define_subagent` somente quando exposta no host;
usar perfis existentes quando suficientes. Não criar centenas de agentes permanentes.

## Fallback de modelos

`route` recomenda candidatos declarados disponíveis e remove os que falharam.
Antes de tentar outra opção, criar checkpoint e verificar seleção nativa disponível.
Se o host permite apenas inherit/flash/pro, usar esses tiers; não mandar um nome como
"Fable 5.1" para um campo incompatível. APIs de terceiros não estão configuradas no
pacote. Falta de cota pode bloquear todos os tiers, sem alternativa automática viável.

Antes de cada rodada, registrar `council-round <mission-id> --spec <round.json>`.
Usar um ID estável de council por missão; não renomear para contornar limite.
O runtime recusa rodadas acima de max_rounds. Reserva de agentes e rodada são
controles distintos: várias reservas podem pertencer à mesma rodada.
