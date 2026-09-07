# HANDOFF — GAU v5 (Antigravity Cognitive Architecture)

**Versão**: 5.0.0  
**Data**: 07 de Setembro de 2026  
**Status**: Operacional, Auditado e Versionado em Git  
**Modelo Padrão**: Gemini 3.8 Flash (High) via `model: inherit`

---

## 1. Visão Geral do Projeto

O **GAU v5** (Grande Arquitetura Unificada) é uma camada de orquestração cognitiva de alta precisão desenhada para o Google Antigravity. Ele transforma o comando nativo `/goal` em uma máquina de execução autônoma rigorosa, orientada por evidências verificáveis, limites orçamentários rígidos e separação de responsabilidades.

O ecossistema implementa integralmente as **69 ideias aprovadas** no documento canônico `GAU_v5_ideias_aprovadas.md`, organizadas em 6 camadas operacionais e apoiadas por um runtime Python local baseado em SQLite WAL sem dependências externas.

---

## 2. Como o `/goal` Foi Integrado

O binário do Antigravity é proprietário e não permite modificação direta de seu código executável. A integração do GAU v5 é realizada de forma nativa e elegante através dos quatro pontos oficiais de extensão da plataforma:

1. **Regra Mestre Always-On** (`.agents/rules/gau-v5.md`):
   - Possui frontmatter `trigger: always_on`.
   - Intercepta qualquer requisição de engenharia e instrui o modelo a ativar a skill `gau-goal`.
2. **Skill Orquestradora** (`.agents/skills/gau-goal/SKILL.md`):
   - Guia o ciclo de vida do `/goal`: baseline de requisitos, roteamento de modelo, delegação para subagentes, checkpoints cognitivos, coleta de evidências e fechamento no gate.
3. **16 Subagentes Especialistas** (`.agents/agents/gau-*.md`):
   - Perfis declarados com ferramentas específicas (`tools`), skills atribuídas e sandboxing ativado.
   - Invocados nativamente via `invoke_subagent` com `model: inherit`.
4. **Runtime de Estado e Evidências** (`.gau/runtime/gau.py`):
   - Executado localmente pelo agente via terminal para controle de missões, reservas de compute, DAG de tarefas, freshness de arquivos por SHA-256 e gate final.

---

## 3. Inventário Completo de Artefatos

### 3.1. Estrutura de Diretórios no Workspace

```text
GAU-v5/
├── .agents/
│   ├── agents/               # 16 perfis de subagentes nativos do Antigravity
│   ├── rules/                # Regra mestre gau-v5.md (Always-On)
│   └── skills/               # 72 skills (69 ideias + gau-goal, gau-council, gau-maintain)
├── .gau/
│   ├── config.json           # Configuração de limites e preferências de modelo
│   ├── docs/                 # Guias de Operação, Contratos e Delegação
│   ├── examples/             # Modelos de JSON para comandos do runtime
│   ├── registry.json         # Catálogo completo das 69 ideias
│   ├── runtime/gau.py        # Runtime CLI Python com SQLite WAL
│   └── state.sqlite3         # Banco de dados de estado, missões e ratings Elo
├── GAU-v5/                   # Código-fonte gerador do pacote e testes unitários
│   ├── build_package.py      # Meta-compilador do payload
│   ├── install.py            # Instalador idempotente com detecção de conflitos
│   └── tests/test_gau.py     # Suíte de 16 testes de invariantes do runtime
├── site/                     # Landing Page & Interface Web (pronta para Vercel)
│   ├── downloads/            # Pacote GAU-v5.zip, checksum SHA-256 e scripts
│   ├── app.js & ideas.js     # Motor da UI e catálogo das 69 ideias
│   ├── index.html            # Página principal com Mission Lab interativo
│   └── vercel.json           # Configurações de deploy e segurança na Vercel
├── tools/
│   ├── package_release.py    # Script de automação para empacotar releases e scripts
│   └── test_deployment.py    # Teste de integridade de deploy para Vercel e GitHub Pages
├── .nojekyll                 # Garante deploy estático direto no GitHub Pages sem Jekyll
├── downloads/                # Espelhamento de downloads para raiz no GitHub Pages
├── index.html                # Redirecionador imediato e redundância total para site/
├── install.ps1 & install.sh  # Instaladores de linha única disponíveis na raiz
├── vercel.json               # Configuração mestre Vercel na raiz (cleanUrls, headers, rewrites)
├── HANDOFF.md                # Este documento de passagem
└── README-ANTIGRAVITY.md     # Guia rápido de bootstrap no Antigravity
```

### 3.2. Os 16 Agentes Especialistas

| Agente | Especialidade | Ferramentas Atribuídas | Skills Chave |
|---|---|---|---|
| `gau-requirements` | Requisitos e Escopo | `view_file`, `grep_search`, `find_by_name`, `list_dir`, `run_command` | 30, 65, 68 |
| `gau-implementer` | Implementação Isolada | `view_file`, `grep_search`, `find_by_name`, `list_dir`, `replace_file_content`, `write_to_file`, `run_command` | 8, 34 |
| `gau-investigator` | Causa e Hipóteses | `view_file`, `grep_search`, `find_by_name`, `list_dir`, `run_command` | 6, 20, 58, 59 |
| `gau-architect` | Arquitetura e Contratos | `view_file`, `grep_search`, `find_by_name`, `list_dir`, `run_command` | 7, 16, 29 |
| `gau-verifier` | Verificação Independente | `view_file`, `grep_search`, `find_by_name`, `list_dir`, `run_command` | 9, 35, 53, 57 |
| `gau-evidence` | Evidência e Proveniência | `view_file`, `grep_search`, `find_by_name`, `list_dir`, `run_command` | 22, 57, 68 |
| `gau-adversarial` | Contraexemplos / Red Team | `view_file`, `grep_search`, `find_by_name`, `list_dir`, `run_command` | 5, 66, 67 |
| `gau-security` | Auditoria de Segurança | `view_file`, `grep_search`, `find_by_name`, `list_dir`, `run_command` | 25 |
| `gau-performance` | Desempenho e Algoritmos | `view_file`, `grep_search`, `find_by_name`, `list_dir`, `run_command` | 26, 32 |
| `gau-ux` | Experiência de Uso / UI | `view_file`, `grep_search`, `find_by_name`, `list_dir`, `run_command` | 27 |
| `gau-database` | Dados e Migrations | `view_file`, `grep_search`, `find_by_name`, `list_dir`, `run_command` | 28 |
| `gau-integration` | Integração e Branches | `view_file`, `grep_search`, `find_by_name`, `list_dir`, `replace_file_content`, `write_to_file`, `run_command` | 29, 34 |
| `gau-research` | Pesquisa Técnica | `view_file`, `grep_search`, `find_by_name`, `list_dir`, `run_command`, `read_url_content`, `search_web` | 24 |
| `gau-memory` | Memória e Checkpoints | `view_file`, `grep_search`, `find_by_name`, `list_dir`, `replace_file_content`, `write_to_file`, `run_command` | 15, 17, 18, 48, 49, 52 |
| `gau-judge` | Júri Supremo e Gate | `view_file`, `grep_search`, `find_by_name`, `list_dir`, `run_command` | 4, 11, 36, 56, 60 |
| `gau-orchestrator` | Meta-Orquestração DAG | `view_file`, `grep_search`, `find_by_name`, `list_dir`, `run_command`, `invoke_subagent`, `manage_subagents`, `send_message` | 38, 39, 40, 41, 46, 47, 62 |

---

## 4. Invariantes de Qualidade e Segurança

1. **Evidence Beats Vote**: Nenhuma votação de conselho pode aprovar uma entrega se houver uma falha reproduzível aberta.
2. **Freshness Engine**: O runtime invalida automaticamente qualquer evidência anterior caso algum arquivo de código ou log tenha sido modificado posteriormente.
3. **Falsa Independência Rejeitada**: Para requisitos marcados com `independent: true`, o sistema rejeita verificação onde implementador e verificador possuem a mesma identidade ou sessão.
4. **Compute Governor**: Tetos orçamentários fixados em `config.json` (máximo de 8 cérebros concorrentes, profundidade 2, até 3 rodadas de debate por conselho).
5. **Anti-Loop**: O detector de novidade bloqueia tentativas repetitivas de mesma estratégia e mesmo erro lexical.

---

## 5. Rotinas e Comandos de Manutenção

### 5.1. Recompilar e Atualizar o Pacote
```powershell
# Recompila as 69 skills e 16 agentes a partir das ideias aprovadas
py -3 GAU-v5\build_package.py

# Reexecuta os testes de invariantes
py -3 -m unittest discover -s GAU-v5\tests -v

# Atualiza a instalação no workspace atual
py -3 GAU-v5\install.py --project .
```

### 5.2. Gerar Novo Pacote de Release para o Site
```powershell
py -3 tools\package_release.py
```
Isso atualiza automaticamente `site/downloads/GAU-v5.zip`, calcula o SHA-256 e gera os instaladores `install.ps1` e `install.sh`.

### 5.3. Testar o Site Localmente
```powershell
# A partir da raiz (testa o redirecionador e links gerais)
py -3 -m http.server 8000
# Acesse: http://localhost:8000 -> redireciona para http://localhost:8000/site/

# Ou servindo diretamente a pasta site
cd site
py -3 -m http.server 8080
# Acesse: http://localhost:8080
```

### 5.4. Publicar na Vercel
```powershell
# Publicação a partir da raiz (usa vercel.json raiz com rewrites automáticos)
vercel --prod

# Ou publicando apenas a pasta site
cd site
vercel --prod
```

### 5.5. Testes de Integridade de Deploy
```powershell
py -3 tools\test_deployment.py
```
