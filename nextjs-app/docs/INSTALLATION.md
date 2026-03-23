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

## Common Issues

1. Prisma client missing

```bash
npm run prisma:generate
```

2. SQLite migration mismatch

```bash
rm -f dev.db
npm run db:provision
```

3. Auth errors

- Verify `AUTH_SECRET` is set.
- Verify `NEXTAUTH_URL` matches your local URL.
