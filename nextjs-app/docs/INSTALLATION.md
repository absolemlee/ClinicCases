# Installation Guide

Last updated: 2026-03-23

This guide installs and runs ClinicCases Next.js locally.

## Prerequisites

- Node.js 18+
- npm 9+
- Git

Optional:

- SQLite viewer for local DB inspection
- PostgreSQL for production-like testing

## 1. Install Dependencies

```bash
npm install
```

## 2. Create Environment File

If `.env.example` exists:

```bash
cp .env.example .env
```

If it does not exist, create `.env` manually and set at least:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="replace-with-a-random-secret"
NEXTAUTH_URL="http://localhost:7676"
```

## 3. Provision Database

```bash
npm run db:provision
```

Alternative Prisma flow:

For PostgreSQL (VPS/production-like):

```bash
npm run prisma:generate
npx prisma db push
npm run db:seed
```

For SQLite (local dev):

```bash
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
```

## 4. Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:7676
```

## 5. Verify Key Routes

- `/login`
- `/cases`
- `/messages`
- `/journals`
- `/board`
- `/users`
- `/groups`

## 6. Build Verification

```bash
npm run lint
npm run build
```

If `npm run build` fails due missing env vars, ensure `.env` values are set and Prisma client is generated.

## 7. Fresh Install / Hard Reset

If you need to completely wipe the local environment and start fresh:

```bash
npm run clean
npm install
npm run db:provision
npm run build
npm run dev
```

The `clean` script removes:
- `node_modules/` (installed packages)
- `.next/` (build artifacts)
- `dev.db` (SQLite database file, if present)
- SQLite temporary files (WAL/SHM)

Note: `.env` is preserved; if you want to reset that too, manually delete it before running `npm install`.

## Common Issues

1. Prisma client missing

```bash
npm run prisma:generate
```

2. Provider mismatch (SQLite vs PostgreSQL)

If you switch `DATABASE_URL` provider, reprovision so the active Prisma schema matches your DB:

```bash
npm run db:provision
```

For PostgreSQL specifically, use schema sync instead of `prisma migrate dev`:

```bash
npx prisma db push
```

3. Auth errors

- Verify `AUTH_SECRET` is set.
- Verify `NEXTAUTH_URL` matches your local URL.
