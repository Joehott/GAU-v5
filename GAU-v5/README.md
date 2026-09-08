# GAU v5 — integração das 69 ideias com Antigravity

Pacote independente reconstruído a partir de `GAU_v5_ideias_aprovadas.md`.
Inclui **69 skills de ideias + 3 de coordenação, 16 perfis de agentes, runtime Python,
instalador e testes**. Não exige API paga adicional nem bibliotecas Python externas.
Consome os recursos e limites da sua conta quando o Antigravity executar agentes.

## 1. Instalar com um comando

Extraia o ZIP. Abra o PowerShell dentro da pasta **GAU-v5** extraída e execute,
trocando o caminho pela pasta do projeto que você abre no Antigravity:

```powershell
py -3 .\install.py --project "C:\Projetos\MeuProjeto"
```

Precisa de Python **3.10 ou superior**. Se `py` não existir mas você tiver Python,
use `python` no lugar de `py -3`. Para Linux/macOS:

```bash
python3 ./install.py --project "/caminho/do/projeto"
```

Não precisa executar como administrador. Instala por projeto: repita o comando
para cada projeto desejado. Não selecione a pasta extraída do próprio pacote.
O instalador verifica conflitos antes de escrever e preserva arquivos existentes.
Reexecutar a mesma versão é seguro. Se um arquivo do GAU foi editado localmente,
a instalação interrompe com o caminho do conflito para você preservar a alteração.

## 2. Confirmar a instalação

No mesmo PowerShell:

```powershell
py -3 .\install.py --project "C:\Projetos\MeuProjeto" --check
py -3 "C:\Projetos\MeuProjeto\.gau\runtime\gau.py" --project "C:\Projetos\MeuProjeto" doctor
```

Esses comandos verificam arquivos e runtime. Depois abra **uma nova conversa no
Antigravity**, com o projeto selecionado, e cole:

```text
Leia a regra gau-v5 e a skill gau-goal. Confirme o acesso ao registry com 69 ideias
sem carregar todas. Execute o doctor do GAU. Liste os perfis gau-* descobertos.
Se a ferramenta nativa de subagentes estiver disponível, invoque gau-evidence para
uma leitura simples de um arquivo deste projeto e devolva o ID real da sessão e
um resumo verificável. Use a reserva de compute em uma missão de diagnóstico.
Se algo não estiver disponível, identifique exatamente o que falta. Não afirme
que ativou agentes apenas porque encontrou arquivos Markdown.
```

**O teste no Antigravity é a confirmação de ativação.** Não é possível validar a
interface do seu computador somente testando os arquivos neste ambiente.

Se a regra não aparecer: abra Customizations → Rules, confira `gau-v5` e selecione
**Always On**. Confirme também a descoberta das skills e dos agentes. O frontmatter
`trigger: always_on` é fornecido; a interface é a confirmação na sua versão.
Para uma instalação antiga que usa `.agent/skills` e `.agent/rules`, desinstale e
reinstale com `--layout legacy`. Os perfis nativos continuam em `.agents/agents`;
se sua versão não suporta agentes personalizados, atualizar o host é necessário
para execução nativa desses perfis. Não há como um ZIP fabricar esse recurso.

## 3. Continuar usando o /goal normal

Depois da ativação, use como sempre:

```text
/goal Corrija os erros do projeto e entregue a solução verificada.
```

Para chamar a integração explicitamente, ou quando a regra não for descoberta:

```text
/goal Use a skill gau-goal e conclua: [SEU OBJETIVO]. Execute os comandos de
.gau/docs/OPERACAO.md, selecione as skills necessárias, use agentes nativos quando
houver trabalho independente e finalize com evidências atuais e gate do GAU.
```

A regra faz o `/goal` carregar o coordenador, que seleciona mecanismos pelo tipo
de tarefa, risco e incerteza. O pacote **não modifica o código interno do /goal**
e não registra outro comando chamado `/goal`. Integração é feita pelos pontos de
extensão do Antigravity: regras, skills, perfis e ferramentas de terminal.

O agente se encarrega dos JSONs, comandos, checkpoints, registros e provas conforme
as skills. Você não precisa preencher todos os exemplos manualmente.

## 4. O que vai para cada lugar

| Destino | Conteúdo | Uso |
|---|---|---|
| `.agents/rules/gau-v5.md` | Entrada da integração | Seleção no trabalho normal e /goal |
| `.agents/skills/gau-goal` | Coordenador da missão | Baseline, seleção, execução, verificação e fechamento |
| `.agents/skills/gau-01-*` até `gau-69-*` | Todas as ideias aprovadas | Carregadas conforme relevância |
| `.agents/agents/gau-*.md` | 16 especialistas reutilizáveis | Sessões reais via host |
| `.agents/skills/gau-council` | Councils, swarms e torneios | Problemas complexos e equipes extensas |
| `.agents/skills/gau-maintain` | Histórico, rankings, memória | Fora do caminho principal da missão |
| `.gau/runtime` | Código de apoio | Evidência, estado, orçamento e roteamento |
| `.gau/docs` e `.gau/examples` | Contratos e comandos | Referência operacional do agente |
| `.gau/state.sqlite3` e `.gau/logs` | Estado e evidências gerados em uso | Retomada e rastreabilidade |

O mapa individual está em **docs/MAPA-69.md**. Nada foi descartado. Ideias de
manutenção ou coordenação extensa têm destinos próprios e podem apoiar `/goal`
quando relevantes; não são obrigadas a rodar a cada tarefa.

Para usar fora do /goal:

```text
Use gau-maintain para revisar a memória e os resultados comprovados deste projeto.
```

```text
Use gau-council para comparar soluções para [PROBLEMA], dentro do orçamento.
```

Se você já tem `/boost` ou `/teamwork-preview`, pode solicitar essas mesmas skills
nesses modos. Disponibilidade depende do host/plano. O instalador não compra,
ativa ou imita recursos ausentes. Não agenda atividades recorrentes automaticamente.

## 5. Modelos, agentes e tamanho do pacote

A preferência original pelo **Gemini 3.8 Flash** está preservada como rótulo em
`.gau/config.json`. Os agentes usam `model: inherit`: selecione no Antigravity o
modelo disponível que deseja herdar. O rótulo não é um ID de API confirmado nem
obriga a plataforma a disponibilizar uma versão específica.

O roteador mantém o modelo escolhido quando não há histórico confiável. Só recomenda
alternativas declaradas disponíveis; Pro não recebe promoção automática por nome.
Trocas efetivas dependem do seletor/ferramenta nativa. Não existem chaves ou adaptadores
para terceiros escondidos no pacote, nem dependência dos preços/benchmarks citados
na conversa anterior.

**Menor ZIP não significa menor inteligência.** O pacote contém texto e código;
não contém pesos dos modelos, SDKs grandes ou dependências duplicadas. O desempenho
precisa ser medido nas suas tarefas. As notas 10/10 da discussão eram expectativas,
não resultados experimentais comprovados deste sistema.

## 6. O que está implementado e seus limites

- **Código executável:** instalador com conflito/reinstalação/desinstalação; estado
  SQLite; requisitos; logs de comandos; hashes de provas; bloqueio de conclusão;
  checkpoints ramificados; DAG; worktrees; reservas; busca de contexto; registros
  de grafo; hipóteses; alerta de repetição; consenso; duelos Elo e fallback recomendado.
- **Execução pelo agente:** as 69 skills transformam cada ideia em procedimento com
  gatilho, entradas, trabalho específico, saída, parada e apoio executável. Councils,
  pesquisa, análise semântica, contraexemplos e testes são executados pelo Antigravity
  com as ferramentas realmente disponíveis.
- **Sem promessa fictícia:** protocolos não garantem obediência absoluta do LLM.
  O runtime não intercepta o scheduler do host, não mede raciocínio interno, não
  treina pesos, não cria acesso a modelos e não prova que um teste cobre todo o produto.
  O histórico de combinações é consultado pelo coordenador; o router numérico usa
  ranking de modelos após amostra mínima. Métricas de consenso/novidade são heurísticas.
- **Independência:** dois papéis numa mesma conversa não são dois agentes independentes.
  O pacote registra SERIAL_LIMITED se faltar capacidade nativa. Requisitos que exigem
  verificador independente continuam bloqueados enquanto essa condição faltar.

O padrão permite até **8 cérebros contando o coordenador**, profundidade 2, seis
filhos por pai, 3 rodadas, 2 horas e limites de telemetria declarada. O agente pode
adaptar orçamento ao pedido e às cotas reais, sem ignorar limites do host.

## 7. Comandos de administração

Simular antes de instalar:

```powershell
py -3 .\install.py --project "C:\Projetos\MeuProjeto" --dry-run
```

Executar os 34 testes do pacote:

```powershell
py -3 -m unittest discover -s tests -v
```

Remover a integração:

```powershell
py -3 .\install.py --project "C:\Projetos\MeuProjeto" --uninstall
```

A desinstalação remove arquivos próprios que continuem intactos. Preserva arquivos
editados, pré-existentes, logs, banco de memória e worktrees. Ela não desfaz alterações
que os agentes fizeram no seu código. Não use reset/clean para desinstalar.

Para restaurar após remoção, executar novamente o comando da seção 1. Memória
preservada pode ser reutilizada após verificar freshness.

## 8. Fontes e validação

Integração baseada na documentação consultada em 06/09/2026:

- [Skills](https://antigravity.google/docs/skills/)
- [Rules](https://antigravity.google/docs/rules-workflows/)
- [Subagents](https://antigravity.google/docs/subagents/)
- [Slash commands e /goal](https://antigravity.google/docs/slash-commands/)

Essas páginas fundamentam locais de descoberta e capacidades nativas. O desenho
de políticas, scripts e limites do GAU é implementação deste pacote. Documentação
do host pode mudar; validar ativação pela seção 2.

Resultado dos testes realizados nesta entrega: **docs/VALIDACAO.md**.
O arquivo de ideias original está em **source/GAU_v5_ideias_aprovadas.md**.
