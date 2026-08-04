# Finanças Viana

Web app de controle financeiro pessoal, acessível pelo navegador do celular na
rede local (Wi-Fi de casa). Backend em FastAPI + SQLite, frontend em React com
Recharts.

## Funcionalidades

- Cadastro de transações (entrada/saída) com valor, data, categoria e descrição
- Cadastro de metas de economia com valor alvo, valor atual e prazo
- Dashboard com gráficos de saldo ao longo do tempo, gastos por categoria e
  progresso das metas

## Estrutura do projeto

```
backend/    API FastAPI + banco SQLite
frontend/   App React (Vite)
```

## Requisitos

- Python 3.10+
- Node.js 18+

## 1. Rodar o backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

O banco de dados SQLite é criado automaticamente em `backend/data/financas.db`
na primeira execução. A API fica disponível em `http://localhost:8000` e a
documentação interativa em `http://localhost:8000/docs`.

`--host 0.0.0.0` é o que permite que outros aparelhos na mesma rede (como o
celular) acessem a API.

## 2. Rodar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O Vite já está configurado (`vite.config.js`) para escutar em `0.0.0.0`, então
ao rodar `npm run dev` ele mostra algo como:

```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.0.42:5173/
```

O frontend detecta automaticamente o endereço da API a partir do host usado
para acessá-lo (mesmo IP, porta 8000) — não é preciso configurar nada extra
para acessar pelo celular. Caso o backend rode em outra máquina, defina a
variável `VITE_API_URL` (ex.: `VITE_API_URL=http://192.168.0.10:8000 npm run dev`).

## 3. Acessar pelo celular

1. Garanta que o celular está conectado à **mesma rede Wi-Fi** do computador.
2. Descubra o IP local do computador:
   - **Linux**: `hostname -I` ou `ip addr show`
   - **macOS**: `ipconfig getifaddr en0` (ou o nome da sua interface de rede)
   - **Windows**: `ipconfig` (procure "Endereço IPv4")
3. No navegador do celular, acesse `http://<IP-DO-COMPUTADOR>:5173`
   (por exemplo, `http://192.168.0.42:5173`).

Se não carregar, verifique se o firewall do computador está bloqueando as
portas 5173 (frontend) e 8000 (API) — libere-as para conexões da rede local.

## API

Todas as rotas ficam sob `/api`:

| Recurso | Rotas |
|---|---|
| Transações | `GET/POST /api/transactions`, `GET/PATCH/DELETE /api/transactions/{id}` |
| Metas | `GET/POST /api/goals`, `GET/PATCH/DELETE /api/goals/{id}`, `POST /api/goals/{id}/contribute` |
| Dashboard | `GET /api/dashboard/balance`, `GET /api/dashboard/spending-by-category`, `GET /api/dashboard/summary` |

Filtros disponíveis em `/api/transactions` e nas rotas de dashboard:
`start_date`, `end_date`, `type`, `category` (parâmetros de query, formato de
data `YYYY-MM-DD`).

## Observações de segurança

Este app foi pensado para uso pessoal dentro de uma rede local confiável (sem
autenticação e com CORS liberado). Não exponha essas portas diretamente para a
internet.
