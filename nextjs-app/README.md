# ClinicCases Next.js

This directory contains the Next.js migration of ClinicCases7.

The app is substantially implemented and already includes core workflows for case management, users/groups, messages, journals, board posts, and password reset.

## Documentation Map

Start here for setup and operation:

- `docs/INSTALLATION.md` (step-by-step install and local run)
- `docs/CONFIGURATION.md` (environment variables and runtime config)
- `docs/DEPLOYMENT.md` (baseline production deployment flow)

For current migration status, use:

- `WHERE_ARE_WE.md` (canonical current-state summary)
- `REMAINING_WORK.md` (verified backlog)
- `ACTUAL_STATUS_REPORT.md` (detailed audit matrix)

Archived/removed top-level docs are listed in `docs/ARCHIVED_DOCUMENTS.md`.

## Quick Start

1. Install dependencies (Node 18+):

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Current Scope (Implemented)

- Authentication and login
- Password reset flow (request/reset)
- Cases: list/detail/new/edit with related notes, contacts, documents, events, assignees
- Users: list/new/edit
- Groups: list/new/edit with permissions
- Messages: inbox/compose/detail
- Journals: list/new/detail with read/archive/comment actions
- Board: post creation/edit/delete, viewers, attachments endpoints
- Utilities: case types and clinic types configuration

## Known Gaps

- `src/app/dashboard/page.tsx` is still a placeholder modernization shell.
- `src/app/preferences/page.tsx` is still a placeholder modernization shell.
- Automated tests are not yet configured.

## Local Database Provisioning (SQLite)

1. Copy env template:

```bash
cp .env.example .env
```

2. Set sqlite URL in `.env`:

```bash
DATABASE_URL="file:./dev.db"
```

3. Provision DB:

```bash
npm run db:provision
```

## Useful Scripts

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run start` - Run production server
- `npm run lint` - Lint checks
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Create/apply dev migration
- `npm run db:seed` - Seed database

## Notes

Email delivery uses Resend via `src/lib/email.ts` and requires `RESEND_API_KEY` to actually send messages.