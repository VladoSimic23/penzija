# Mirovine Monorepo

Ovaj repozitorij sadrzi oba projekta u jednom GitHub repou:

- `frontend/my-app` - Next.js aplikacija
- `backend/penzija` - Sanity Studio backend

## Struktura

```text
mirovine/
  backend/
    penzija/
  frontend/
    my-app/
```

## Instalacija

Pokreni instalaciju ovisnosti odvojeno za frontend i backend:

```bash
npm --prefix frontend/my-app install
npm --prefix backend/penzija install
```

## Pokretanje

Iz root foldera (`mirovine/`):

```bash
# Frontend
npm run dev:frontend

# Sanity Studio backend
npm run dev:backend
```

Po zelji mozes koristiti i direktno iz podfoldera:

```bash
cd frontend/my-app
npm run dev

cd ../../backend/penzija
npm run dev
```

## Build

```bash
npm run build:frontend
npm run build:backend
```

## Environment varijable

Primjeri su vec dodani:

- `frontend/my-app/.env.example`
- `backend/penzija/.env.example`

Za lokalni rad kopiraj ih u:

- `frontend/my-app/.env.local`
- `backend/penzija/.env`

## Push na jedan GitHub repo

Ako jos nisi inicijalizirao Git u rootu:

```bash
git init
git add .
git commit -m "Initial monorepo commit"
git branch -M main
git remote add origin <tvoj-github-repo-url>
git push -u origin main
```

Ako vec imas root git repo, samo uradi standardni commit + push.
