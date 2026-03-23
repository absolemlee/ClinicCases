# ClinicCases Next.js - Project Summary

Last updated: 2026-03-23

This file is a high-level historical summary. For current status and backlog, use:

- `WHERE_ARE_WE.md`
- `REMAINING_WORK.md`
- `ACTUAL_STATUS_REPORT.md`

## What This Migration Achieved

The migration has moved ClinicCases from legacy PHP toward a modern Next.js app with Prisma-backed APIs and role-aware UI flows.

Major functional areas implemented in code:

- Authentication and password reset flows
- Cases CRUD and related entities (notes, contacts, documents, events, assignees)
- Users and groups management
- Messaging workflows
- Journals workflows
- Board/announcements workflows
- Utilities for case and clinic type configuration

## Current Reality

The app is substantially implemented but not fully complete.

Verified remaining functional gaps:

1. `src/app/dashboard/page.tsx` is still placeholder-level.
2. `src/app/preferences/page.tsx` is still placeholder-level.
3. Automated tests are still missing.

## Technical Baseline

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- ORM: Prisma
- Auth: Auth.js
- Styling: Tailwind CSS
- Email: Resend integration (environment-dependent)

## Documentation Policy (Going Forward)

To prevent status drift:

1. Update `WHERE_ARE_WE.md` whenever feature status changes.
2. Keep `REMAINING_WORK.md` as the single actionable backlog.
3. Use `ACTUAL_STATUS_REPORT.md` for evidence-backed matrix updates.
4. Treat other milestone docs as archival context.

## Next Milestone Definition

Migration milestone is complete when:

1. Dashboard and preferences placeholders are replaced with production behavior.
2. Build/lint/type checks pass reliably in a repeatable environment.
3. Baseline automated tests cover critical paths.