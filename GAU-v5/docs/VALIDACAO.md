# Validação desta entrega

Data: 06/09/2026. Ambiente: Python 3 em Linux, projetos temporários isolados.

Resultado: **16 testes automatizados passaram**, além de validação dos frontmatters
YAML das 72 skills e 16 perfis. Uma revisão independente executou instalação e fluxos
reais de missão; os problemas encontrados foram corrigidos e cobertos por regressão.

Casos verificados:

- Instalação, reinstalação, integridade, conflito e desinstalação preservando arquivos do usuário.
- Requisito sem prova impede conclusão; processo real PASS permite cobertura.
- Arquivo novo/modificado ou log adulterado invalida prova anterior.
- FAIL atual exige correção explicitamente vinculada.
- Tarefas e dependências com evidência stale deixam de ser DONE.
- CLI aceita a ordem de argumentos documentada e captura execução real.
- Autodeclaração estruturalmente falsa de independência é rejeitada.
- Claim crítico aberto bloqueia conclusão e resolução exige prova atual.
- Limite simultâneo de cérebros, reserva com pai encerrado e teto de rodadas.
- Roteamento exclui modelos indisponíveis/falhos e não promove Elo com amostra pequena.
- Checkpoint ramificado fica stale depois de mudança relevante.
- Estratégia repetida recebe bloqueio heurístico.
- Duelo duplicado não é contado novamente.
- Symlink de armazenamento não permite escrever fora do projeto.
- IDs 1–69 completos e referências entre perfis e skills existentes.

Comando reproduzível na pasta extraída:

```powershell
py -3 -m unittest discover -s tests -v
```

Limites da validação: não houve execução no Antigravity do usuário, teste no Windows,
medição de qualidade de modelos, carga de 12 agentes nem validação de cotas/assinatura.
Frontmatter válido não comprova descoberta no host. O README fornece teste de ativação
real. SQLite e políticas locais dão suporte ao agente; não controlam o scheduler nativo.
