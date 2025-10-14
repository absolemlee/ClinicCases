# ClinicCases Next.js pilot

This directory hosts the initial scaffolding for a phased migration of ClinicCases into a modern Next.js application.
The structure mirrors the legacy PHP templates catalogued in `documentation/nextjs-migration-guide.md` so that each
workflow can be rewritten incrementally.

## Getting started

1. Install dependencies (requires Node 18+):
   ```bash
   npm install
   ```
2. Launch the development server:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:3000` to explore the placeholder routes.

> **Note**
> Package installation is not attempted automatically in this repository because the execution environment used to
> prepare this commit does not provide external network access. Run `npm install` locally to hydrate `node_modules`.

## Directory highlights

- `src/app` &ndash; App Router pages that correspond to the major PHP templates (Cases, Messages, Journals, etc.).
- `src/components` &ndash; Shared React components like the primary navigation and migration callouts.
- `src/lib/data/navigation.ts` &ndash; Centralized definition of navigation sections to keep the PHP-to-React mapping explicit.
- `src/app/documentation/migration/page.tsx` &ndash; Embeds the upstream migration research file and enumerates the initial
  implementation phases derived from it.

Future work will introduce Prisma models, API routes, and progressively enhanced UI components to replace each legacy
workflow while keeping parity with the documented data schema.

## Local DB provisioning (SQLite)

This project supports quick local provisioning using SQLite so you can run Prisma without a Postgres instance.

1. Copy the example env:

```bash
cp .env.example .env
```

2. Edit `.env` and set DATABASE_URL to a sqlite file, for example:

```bash
DATABASE_URL="file:./dev.db"
```

3. Run the provisioning script:

```bash
npm run db:provision
```

The script will detect the sqlite URL, copy the sqlite Prisma schema into `prisma/schema.prisma`, run `prisma generate`, and attempt a migration. For Postgres provisioning, set `PG_SUPERUSER_URL` and a Postgres-style `DATABASE_URL` instead.
