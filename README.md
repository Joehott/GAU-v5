# GAU v5 Site

Landing page estática e interativa do GAU v5 para Antigravity.

## Estrutura

- `index.html` - página principal
- `styles.css` - layout, responsividade e animações
- `ideas.js` - base das 69 ideias aprovadas
- `app.js` - busca, filtros, animações, copiar comando e Mission Lab
- `assets/` - marca e favicon em SVG
- `vercel.json` - configuração de deploy na Vercel

## Teste local rápido

No PowerShell, dentro desta pasta:

```powershell
py -3 -m http.server 8080
```

Depois abra:

```text
http://localhost:8080
```

## Deploy na Vercel pelo terminal

1. Extraia o ZIP.
2. Abra o PowerShell dentro da pasta `GAU-v5-Site`.
3. Instale a CLI da Vercel, se ainda não tiver:

```powershell
npm install -g vercel
```

4. Faça login:

```powershell
vercel login
```

5. Publique a prévia:

```powershell
vercel
```

6. Publique em produção:

```powershell
vercel --prod
```

A Vercel detecta a pasta como site estático, portanto não é necessário build.

## Importante sobre o Mission Lab

O Mission Lab desta landing page é uma simulação visual e determinística do fluxo cognitivo. Ele não afirma invocar agentes reais do Antigravity. A execução real de subagentes exige o pacote GAU instalado, a CLI do Antigravity e autenticação válida na máquina de destino.
