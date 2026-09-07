# Guia de Ativação e Bootstrap no Antigravity — GAU v5

Este guia instrui o Antigravity (ou qualquer nova sessão de desenvolvimento) a carregar, configurar e operar com o **GAU v5**.

---

## 1. Verificação Imediata da Instalação

Abra uma conversa no Antigravity com a pasta deste projeto (`GAU-v5`) selecionada e envie o seguinte prompt de diagnóstico:

```text
Leia a regra gau-v5 e a skill gau-goal. Confirme o acesso ao registry com 69 ideias
sem carregar todas. Execute o doctor do GAU. Liste os perfis gau-* descobertos.
Se a ferramenta nativa de subagentes estiver disponível, invoque gau-evidence para
uma leitura simples de um arquivo deste projeto e devolva o ID real da sessão e
um resumo verificável. Use a reserva de compute em uma missão de diagnóstico.
Se algo não estiver disponível, identifique exatamente o que falta. Não afirme
que ativou agentes apenas porque encontrou arquivos Markdown.
```

O Antigravity deverá:
1. Reconhecer a regra mestre em `.agents/rules/gau-v5.md` (Always-On).
2. Carregar a skill coordenadora `.agents/skills/gau-goal`.
3. Executar `python .gau/runtime/gau.py doctor` no terminal integrado.
4. Identificar os 16 perfis nativos em `.agents/agents/`.

---

## 2. Como Usar o `/goal` com GAU v5

Uma vez que a regra Always-On está ativa, você pode utilizar o `/goal` normalmente:

```text
/goal Desenvolva [SUA_FUNCIONALIDADE] com cobertura de testes e entrega verificada.
```

### O que o agente faz nos bastidores:
1. **Baseline**: Cria a missão formal em `.gau/missions/<nome>/mission.json` com requisitos únicos e critérios de prova.
2. **Roteamento Adaptativo**: Avalia incerteza e risco via `gau-01-adaptive-model-router-3-0` e seleciona as skills necessárias no `registry.json`.
3. **Reserva de Computação**: Registra reservas no `Compute Governor` antes de acionar subagentes.
4. **Isolamento de Código**: Aloca worktrees Git para implementadores paralelos (`gau-08` e `gau-34`).
5. **Auditoria Independente**: Invoca `gau-verifier` e `gau-adversarial` para testar a solução sem presunção de acerto.
6. **Freshness & Gate**: Audita os hashes SHA-256 de todos os arquivos e só fecha a missão se o `gau.py gate` retornar `COMPLETE`.

---

## 3. Comandos Rápidos do Runtime Local (`gau.py`)

No terminal do Antigravity (PowerShell ou Bash):

| Ação | Comando |
|---|---|
| Diagnóstico do Sistema | `py -3 .gau/runtime/gau.py doctor` |
| Criar Nova Missão | `py -3 .gau/runtime/gau.py new --spec .gau/examples/mission.json` |
| Ver Status do Gate | `py -3 .gau/runtime/gau.py status <mission-id>` |
| Testar e Registrar Prova | `py -3 .gau/runtime/gau.py verify <mission-id> --spec <spec.json> --command <comando>` |
| Gate de Conclusão | `py -3 .gau/runtime/gau.py gate <mission-id>` |
| Fechar Missão | `py -3 .gau/runtime/gau.py close <mission-id>` |

---

## 4. Estrutura das Extensões Antigravity

- **`.agents/rules/gau-v5.md`**: Regra sempre ativa que direciona pedidos de engenharia para o GAU.
- **`.agents/skills/`**: 72 skills modulares prontas para execução. O agente carrega apenas as skills necessárias para o contexto da tarefa.
- **`.agents/agents/`**: 16 subagentes com permissões de sandbox e ferramentas calibradas:
  - Implementação: `gau-implementer`, `gau-integration`
  - Auditoria & Provas: `gau-verifier`, `gau-evidence`, `gau-adversarial`, `gau-security`
  - Arquitetura & Dados: `gau-architect`, `gau-database`, `gau-performance`
  - Coordenação & Juízo: `gau-orchestrator`, `gau-judge`, `gau-requirements`
  - Conhecimento & Raciocínio: `gau-investigator`, `gau-memory`, `gau-research`, `gau-ux`

---

## 5. Site e Distribuição Web

Para visualizar o site interativo com Mission Lab:
```powershell
py -3 -m http.server 8080 --directory site
# Abra http://localhost:8080
```

Para gerar novos pacotes de download para produção:
```powershell
py -3 tools/package_release.py
```
Isso atualiza `site/downloads/GAU-v5.zip` com o checksum SHA-256 correspondente e os instaladores de linha única.
