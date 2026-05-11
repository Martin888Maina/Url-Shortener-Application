# URL Shortener

A full-stack URL shortener built with React, Node.js, Express, and PostgreSQL, backed by the [TinyURL API](https://tinyurl.com/app/dev). Paste a long link, get a tiny one, and keep a searchable history of everything you have shortened.

## Features

- Shorten any http or https URL through the TinyURL API
- Optional custom aliases (e.g. `tinyurl.com/my-portfolio`)
- Persistent history backed by PostgreSQL — links survive page reloads and server restarts
- One-click copy to clipboard
- Delete links you no longer need
- Light UI with a 4-step usage guide
- Production-ready: env-driven config, restricted CORS, prod error handling, gitignored secrets

## Tech stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Frontend     | React 19 (Vite)                         |
| Styling      | Pure CSS (CSS variables, no frameworks) |
| Backend      | Node.js 20 + Express 4                  |
| Database     | PostgreSQL 16                           |
| URL Service  | TinyURL API v2 (Bearer token auth)      |
| Deployment   | DigitalOcean Droplet (Ubuntu 24.04 LTS) |
| Process Mgr  | PM2                                     |
| Web Server   | Nginx (reverse proxy + static serving)  |
| SSL          | Let's Encrypt (Certbot)                 |

## Architecture

```
  Browser  ─▶  Nginx (:443)  ─┬─▶  React build (static)
                              │
                              └─▶  /api/*  ─▶  Express (:4000)  ─┬─▶  PostgreSQL
                                                                 └─▶  TinyURL API
```

The TinyURL token lives only on the server. The browser never sees it and never calls TinyURL directly.

## Project layout

```
url-shortener/
├── client/              # React frontend (Vite)
│   ├── public/          # Favicons + site.webmanifest
│   ├── src/
│   │   ├── api/         # fetch wrappers for the backend
│   │   ├── components/  # URLForm, URLList, URLItem, UsageGuide
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── .env.example
├── server/              # Node.js backend (Express)
│   ├── db/
│   │   ├── schema.sql   # urls table + indexes
│   │   └── pool.js      # pg Pool
│   ├── routes/urls.js   # POST/GET/DELETE /api/urls
│   ├── services/tinyurl.js
│   ├── index.js         # Express app + CORS + health check
│   └── .env.example
├── README.md
└── LICENSE.txt
```

## Prerequisites

- Node.js 20 or later
- PostgreSQL 14 or later running locally
- A TinyURL API token (free — get one at <https://tinyurl.com/app/dev>)

## Local setup

### 1. Clone the repo

```bash
git clone https://github.com/Martin888Maina/Url-Shortener-Application.git
cd Url-Shortener-Application
```

### 2. Set up PostgreSQL

```bash
sudo -u postgres psql
```
Inside `psql`:
```sql
CREATE DATABASE url_shortener;
CREATE USER shortener_user WITH PASSWORD 'choose_a_local_password';
GRANT ALL PRIVILEGES ON DATABASE url_shortener TO shortener_user;
\c url_shortener
GRANT ALL ON SCHEMA public TO shortener_user;
\q
```

Apply the schema:
```bash
psql -U shortener_user -d url_shortener -h localhost -f server/db/schema.sql
```

### 3. Configure backend

```bash
cd server
cp .env.example .env
```
Edit `server/.env` and set real values for:
- `TINYURL_TOKEN` — your TinyURL Bearer token
- `DATABASE_URL` — `postgresql://shortener_user:choose_a_local_password@localhost:5432/url_shortener`
- `CLIENT_ORIGIN` — `http://localhost:5173` for local Vite

Install and run:
```bash
npm install
npm run dev
```

The API listens on `http://localhost:4000`. Verify with:
```bash
curl http://localhost:4000/api/health
# {"ok":true,"db":"connected"}
```

### 4. Configure and run frontend

```bash
cd ../client
cp .env.example .env
npm install
npm run dev
```

Open <http://localhost:5173>. Paste a long URL, click **Shorten**, and you should see a TinyURL appear in the list.

## Environment variables

### `server/.env`

| Variable        | Example                                                            | Purpose                                   |
| --------------- | ------------------------------------------------------------------ | ----------------------------------------- |
| `PORT`          | `4000`                                                             | Port the Express server listens on        |
| `NODE_ENV`      | `development` / `production`                                       | Toggles stack-trace exposure in errors    |
| `TINYURL_TOKEN` | `(your TinyURL Bearer token)`                                      | Authenticates server → TinyURL API        |
| `DATABASE_URL`  | `postgresql://shortener_user:PWD@localhost:5432/url_shortener`     | PostgreSQL connection string              |
| `CLIENT_ORIGIN` | `http://localhost:5173`                                            | Comma-separated allowed CORS origins      |

### `client/.env`

| Variable        | Example                  | Purpose                                       |
| --------------- | ------------------------ | --------------------------------------------- |
| `VITE_API_URL`  | `http://localhost:4000`  | Base URL the React app uses to call the API   |

The `.env` files are gitignored. Use the committed `.env.example` files as templates.

## API reference

| Method | Path             | Body / Params                                        | Description                                |
| ------ | ---------------- | ---------------------------------------------------- | ------------------------------------------ |
| GET    | `/api/health`    | —                                                    | Liveness + DB ping                         |
| POST   | `/api/urls`      | `{ "original_url": "https://...", "custom_alias"? }` | Shorten a URL and persist it               |
| GET    | `/api/urls`      | —                                                    | List all URLs, newest first                |
| DELETE | `/api/urls/:id`  | —                                                    | Delete a URL by id                         |

## Security notes

- `TINYURL_TOKEN` stays on the server — never sent to the browser, never committed to git
- CORS is locked to the value of `CLIENT_ORIGIN` (no wildcard `*` in production)
- Error responses hide stack traces when `NODE_ENV=production`
- Parameterised SQL throughout (`$1`, `$2`) — no string interpolation, no SQL injection surface

## Future enhancements

- QR codes for each shortened URL
- Click-through tracking (the `click_count` column is in place)
- Per-link expiry dates
- User accounts so links are scoped to who created them
- Bulk shortening from a CSV upload

## License

[MIT](LICENSE.txt) © Martin Maina
