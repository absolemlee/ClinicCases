# ClinicCases Next.js - Actual Status Report

Date: 2026-03-23
Method: source inspection and workspace diagnostics

## Important Caveat

This session could not execute terminal commands due an environment filesystem provider error, so build/lint execution was not re-verified here. Feature status below reflects code presence and implementation depth, not a full runtime certification.

## Inventory Snapshot

- App pages (`src/app/**/page.tsx`): 27
- API route files (`src/app/api/**/route.ts`): 33
- Prisma models (`prisma/schema.prisma`): 17

## Feature Matrix

| Area | Status | Evidence |
| --- | --- | --- |
| Authentication | Implemented | `src/app/login/page.tsx`, `src/app/api/auth/[...nextauth]/route.ts` |
| Password reset | Implemented (env-dependent email delivery) | `src/app/password-reset/request/page.tsx`, `src/app/password-reset/reset/page.tsx`, `src/app/api/auth/password-reset/*`, `src/lib/email.ts` |
| Cases CRUD | Implemented | `src/app/cases/page.tsx`, `src/app/cases/new/page.tsx`, `src/app/cases/[id]/page.tsx`, `src/app/cases/[id]/edit/page.tsx`, `src/app/api/cases/*` |
| Case notes/contacts/events/assignees/documents | Implemented | `src/app/api/case-notes/route.ts`, `src/app/api/case-contacts/route.ts`, `src/app/api/case-events/route.ts`, `src/app/api/cases/[id]/assignees/*`, `src/app/api/cases/[id]/documents/*` |
| Users | Implemented | `src/app/users/page.tsx`, `src/app/users/new/page.tsx`, `src/app/users/[id]/edit/page.tsx`, `src/app/api/users/*` |
| Groups | Implemented | `src/app/groups/page.tsx`, `src/app/groups/new/page.tsx`, `src/app/groups/[id]/edit/page.tsx`, `src/app/api/groups/*` |
| Messages | Implemented | `src/app/messages/page.tsx`, `src/app/messages/compose/page.tsx`, `src/app/messages/[id]/page.tsx`, `src/app/api/messages/*` |
| Journals | Implemented | `src/app/journals/page.tsx`, `src/app/journals/new/page.tsx`, `src/app/journals/[id]/page.tsx`, `src/app/api/journals/*` |
| Board | Implemented | `src/app/board/page.tsx`, `src/app/api/board/*` |
| Utilities/config tables | Implemented | `src/app/utilities/page.tsx`, `src/app/api/case-types/route.ts`, `src/app/api/clinic-types/route.ts`, `src/app/api/case-columns/route.ts` |
| Dashboard | Placeholder / partial | `src/app/dashboard/page.tsx` |
| Preferences | Placeholder / partial | `src/app/preferences/page.tsx` |
| Automated tests | Not implemented | no test scripts/tooling detected in `package.json` |

## Confirmed Gaps

1. Dashboard is not wired to real data widgets yet.
2. Preferences/profile page is still a migration placeholder.
3. Test coverage is absent.
4. Email delivery behavior depends on environment variables (`RESEND_API_KEY`, `EMAIL_FROM`, `NEXTAUTH_URL`).

## Documentation Consistency Issue

Multiple status markdown files use different completion percentages and timelines. This causes confusion.

Canonical set moving forward:

1. `WHERE_ARE_WE.md` - current snapshot
2. `REMAINING_WORK.md` - actionable backlog
3. `ACTUAL_STATUS_REPORT.md` - detailed matrix
4. `docs/INSTALLATION.md` - setup instructions
5. `docs/CONFIGURATION.md` - runtime configuration

## Practical Readiness Assessment

- Core app workflows: strong and broadly implemented.
- Migration completeness: high but not finished.
- Production confidence: moderate until build/lint/test validation is re-run and placeholder pages are completed.