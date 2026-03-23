# ClinicCases Next.js - Current State

Last updated: 2026-03-23
Primary status doc: this file

## Executive Summary

The migration is far along and usable for core operations. Most legacy workflows are implemented in Next.js, but the project is not fully finished.

Current state based on code review:

- Core workflows implemented: cases, messages, users, groups, journals, board, auth/password reset.
- Database schema implemented in Prisma and mapped to legacy tables.
- Major placeholders still present in dashboard and preferences pages.
- Documentation is fragmented and partly stale.
- Automated tests are not present.
- This review could not run terminal build/lint checks because the execution environment reported a filesystem provider error for terminal commands.

## What Is Implemented

Evidence is in `src/app`, `src/app/api`, and `prisma/schema.prisma`.

- App pages: 27 route pages under `src/app/**/page.tsx`.
- API route files: 33 route handlers under `src/app/api/**/route.ts`.
- Data models: 17 Prisma models in `prisma/schema.prisma`.

Implemented functional areas:

- Authentication and session handling
  - Login page and Auth.js route present
  - Password reset request/reset pages and APIs present
- Case management
  - Case list/detail/new/edit pages present
  - Case notes, contacts, documents, events, assignees APIs present
- Users and groups
  - User list/new/edit pages and APIs present
  - Group list/new/edit pages and APIs present
- Journals
  - List/new/detail pages and full journals API set present
- Board
  - Board page plus CRUD APIs and attachments endpoints present
- Messages
  - Inbox/compose/detail pages and message APIs present
- Utilities/config
  - Case types and clinic types endpoints/pages present

## Known Gaps (Verified)

1. Dashboard page is still a migration placeholder shell.
   - File: `src/app/dashboard/page.tsx`
2. Preferences page is still a migration placeholder shell.
   - File: `src/app/preferences/page.tsx`
3. Automated tests are not configured.
   - No unit/integration/e2e framework or test suites detected in project scripts.
4. Email sending depends on environment configuration.
   - `src/lib/email.ts` includes fallback behavior when `RESEND_API_KEY` is not configured.

## Documentation Health

Several markdown files contain contradictory completion percentages and historical claims from different dates.

Use these as current anchors:

- `WHERE_ARE_WE.md` (this file): canonical state snapshot
- `REMAINING_WORK.md`: actionable backlog
- `ACTUAL_STATUS_REPORT.md`: detailed audit matrix
- `docs/INSTALLATION.md`: installation instructions
- `docs/CONFIGURATION.md`: environment and runtime configuration

Treat older one-off milestone docs as historical records, not canonical status.

## Immediate Priorities

1. Implement dashboard widgets with live data (`src/app/dashboard/page.tsx`).
2. Implement user preferences/profile/password UI and APIs (`src/app/preferences/page.tsx`).
3. Add automated testing baseline (API and core UI paths).
4. Run full build/lint/typecheck in a working terminal and record results.
5. Consolidate or archive stale status markdown files.

## Confidence and Limits

This assessment is based on direct source inspection and editor diagnostics. It is high confidence for feature presence and placeholder detection.

Runtime confidence is moderate until build/lint/test checks are executed in an environment where terminal commands work.