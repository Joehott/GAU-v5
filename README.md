# GAU v5 — Cognitive Orchestration Layer para Antigravity

[![Antigravity](https://img.shields.io/badge/Antigravity-Ready-brightgreen)](https://antigravity.google)
[![GitHub](https://img.shields.io/badge/GitHub-Joehott%2FGAU--v5-181717?logo=github)](https://github.com/Joehott/GAU-v5)
[![Skills](https://img.shields.io/badge/Skills-72-blue)](#)
[![Agents](https://img.shields.io/badge/Agents-16-orange)](#)
[![Tests](https://img.shields.io/badge/Tests-34%20passing-success)](#)
[![License](https://img.shields.io/badge/License-MIT-purple)](#)

O **GAU v5** (Grande Arquitetura Unificada) é um framework autônomo e verificável de engenharia de software para o Google Antigravity. Ele dota o comando `/goal` de governança cognitiva com 69 ideias integradas, 16 perfis de subagentes nativos, tolerância zero a conclusões sem prova, e isolamento de tarefas concorrentes em Git worktrees.

---

## 🚀 Comando do Antigravity ("Leia e Execute")

Copie e cole este comando diretamente no chat de qualquer nova conversa no Antigravity para inicializar e ativar imediatamente o GAU v5:

```text
Leia e execute as extensões do GAU v5 deste workspace:
1. Carregue a regra always-on em .agents/rules/gau-v5.md e a skill gau-goal.
2. Inspecione o catálogo de 69 ideias em .gau/registry.json e execute o diagnóstico com "python .gau/runtime/gau.py doctor".
3. Confirme os 16 perfis de subagentes nativos em .agents/agents/gau-*.md.
4. Conduza todo pedido de engenharia e /goal sob o protocolo do GAU: baseline de requisitos, governança de compute, worktrees Git, e aprovação estrita com evidência atual no gate do GAU.
```

---

## ⚡ Início Rápido

### Instalar no seu projeto via PowerShell (Linha Única)

```powershell
iwr -useb https://joehott.github.io/GAU-v5/install.ps1 | iex
```

### Instalar no seu projeto via Bash (Linux / macOS)

```bash
curl -fsSL https://joehott.github.io/GAU-v5/install.sh | bash
```

### Instalar localmente (deste repositório)

```powershell
py -3 GAU-v5\install.py --project "C:\Caminho\Do\Seu\Projeto"
```

Depois, verifique o runtime:
```powershell
py -3 .gau\runtime\gau.py doctor
```

---

## 🧭 Documentação e Guias

- **[Guia de Bootstrap no Antigravity](README-ANTIGRAVITY.md)**: Instruções de diagnóstico e ativação dos subagentes nativos.
- **[Documento de Handoff Técnico](HANDOFF.md)**: Inventário completo da arquitetura, contratos, banco SQLite e garantias de segurança.
- **[Guia de Operações](.gau/docs/OPERACAO.md)**: Referência de todos os comandos CLI do runtime local.
- **[Protocolo de Delegação](.gau/docs/DELEGACAO.md)**: Como o coordenador reserva compute e orquestra swarms de agentes.
- **[Mapa das 69 Ideias](GAU-v5/docs/MAPA-69.md)**: Mapeamento detalhado de cada mecanismo e seu comando executável.

---

## 🌐 Site e Mission Lab (Vercel)

A interface interativa do GAU v5 conta com o **Mission Lab**, simulador visual da arquitetura em 6 camadas, atlas das 69 ideias e links de download.

Para testar localmente:
```powershell
py -3 -m http.server 8080 --directory site
# Acesse http://localhost:8080
```

Para gerar novos pacotes de release:
```powershell
py -3 tools\package_release.py
```

Para publicar na Vercel:
```powershell
cd site
vercel --prod
```

---

## 🧪 Testes de Invariantes

Para rodar a suíte completa de 34 testes de integração e invariantes:
```powershell
py -3 -m unittest discover -s GAU-v5\tests -v
```
