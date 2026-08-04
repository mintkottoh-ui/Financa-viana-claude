# Finanças Viana

PWA de controle financeiro pessoal que roda **inteiramente no navegador do
celular** — sem backend, sem servidor, sem depender de nenhum computador
ligado. Os dados ficam salvos localmente no aparelho (IndexedDB) e o app
funciona offline depois de instalado.

## Funcionalidades

- Cadastro de transações (entrada/saída) com valor, data, categoria e descrição
- Cadastro de metas de economia com valor alvo, valor atual e prazo
- Dashboard com gráficos de saldo ao longo do tempo, gastos por categoria e
  progresso das metas
- Exportar/importar backup dos dados em um arquivo `.json`
- Instalável como app na tela inicial (PWA), funciona offline

## Como instalar no celular

O app é publicado automaticamente no GitHub Pages a cada push. Não precisa de
notebook, servidor ou rede local — só abrir o link uma vez para instalar.

1. No celular, abra no navegador:

   **https://mintkottoh-ui.github.io/Financa-viana-claude/**

2. Instale na tela inicial:
   - **Android (Chrome)**: menu (⋮) → "Adicionar à tela inicial" ou "Instalar
     app"
   - **iPhone (Safari)**: botão de compartilhar (□↑) → "Adicionar à Tela de
     Início"
3. Pronto — abra pelo ícone que apareceu na tela inicial. A partir daí o app
   funciona offline, sem precisar de internet nem de qualquer computador.

Depois de instalado, sempre que o app for atualizado (novo push no repositório)
ele se atualiza sozinho na próxima vez que for aberto com internet.

## Onde os dados ficam guardados

Tudo roda no navegador do próprio celular: os dados (transações e metas) são
salvos localmente via IndexedDB, não existe nenhum servidor ou banco de dados
externo. Isso quer dizer:

- **Não sincroniza** entre aparelhos automaticamente.
- **Pode ser perdido** se você desinstalar o app, limpar os dados do
  navegador, ou trocar de celular.

Por isso o app tem uma aba **Backup**: use "Exportar backup" periodicamente
para baixar um arquivo `.json` com tudo (salve no Google Drive, e-mail, etc.),
e "Importar backup" para restaurar em outro aparelho ou depois de uma
reinstalação.

## Estrutura do projeto

```
frontend/   App React (Vite) — PWA 100% client-side
  src/db/          Camada de dados local (Dexie / IndexedDB)
  src/pages/        Dashboard, Transações, Metas, Backup
  src/components/   Formulários, listas e gráficos (Recharts)
.github/workflows/  Deploy automático para o GitHub Pages
```

## Rodando localmente (desenvolvimento)

```bash
cd frontend
npm install
npm run dev
```

Abre em `http://localhost:5173`. Como não há backend, isso já é o app
completo — os dados ficam no IndexedDB do navegador que você está usando.

Para gerar o build de produção (o mesmo que o GitHub Actions publica):

```bash
npm run build
npm run preview   # serve dist/ localmente para testar
```

## Deploy (GitHub Pages)

O workflow `.github/workflows/deploy.yml` builda `frontend/` e publica em
GitHub Pages a cada push nas branches `main` ou
`claude/personal-finance-app-qzoegx`. Requisitos únicos (já configurados):

- Repositório público (Pages gratuito exige isso, a menos que você tenha
  GitHub Pro/Team).
- Em **Settings → Pages**, a fonte deve estar como "GitHub Actions" (o
  workflow tenta configurar isso automaticamente no primeiro deploy).

Se quiser publicar em outro host estático (Netlify, Vercel, Cloudflare
Pages), rode `npm run build` dentro de `frontend/` e suba a pasta `dist/` —
é um site 100% estático, sem variáveis de ambiente nem backend para
configurar.
