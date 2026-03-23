# Remaining Work - Verified Backlog

Last updated: 2026-03-23

This backlog reflects current code reality, not historical estimates.

## P0 - Complete Placeholder Pages

1. Dashboard implementation
- Current: placeholder cards and legacy mapping callout only.
- File: `src/app/dashboard/page.tsx`
- Required:
  - Wire to real APIs (board summary, recent activity, upcoming events, quick stats)
  - Replace static widget text with live data components

2. Preferences implementation
- Current: placeholder page with migration notes.
- File: `src/app/preferences/page.tsx`
- Required:
  - User profile edit form
  - Password change form
  - Notification preferences (if still in scope)
  - Backing API routes and validation

## P1 - Validation and Safety

3. Automated testing baseline
- Current: no tests configured in scripts.
- Required:
  - Unit tests for core utilities (`src/lib/*`)
  - API integration tests for high-risk routes (auth reset, cases CRUD, document flows)
  - Smoke tests for critical UI routes (login, cases, messages)

4. Build/lint/type validation in CI-like conditions
- Current session limitation: terminal command execution unavailable due filesystem provider issue.
- Required:
  - Run `npm install`
  - Run `npm run lint`
  - Run `npm run build`
  - Record and fix failures

## P2 - Production Hardening

5. Environment and secrets validation
- Verify `RESEND_API_KEY`, `EMAIL_FROM`, and app URLs are configured per environment.
- Confirm password reset emails send successfully in non-dev environment.

6. Observability and audit trail
- Add structured action logging for critical mutations.
- Add basic error monitoring and request tracing.

7. Data and deployment readiness
- Validate migration strategy for target production database.
- Document backup/restore and rollback procedures.

## P3 - Cleanup and Documentation Hygiene

8. Reduce status-document fragmentation
- Keep these as canonical:
  - `WHERE_ARE_WE.md`
  - `REMAINING_WORK.md`
  - `ACTUAL_STATUS_REPORT.md`
- Mark older milestone docs as archival to avoid conflicting claims.

## Out of Scope (For Now)

These are enhancements, not blockers for core parity:

- Rich-text journal editor
- Advanced cross-entity search
- Reporting/export features
- Calendar synchronization

## Definition of Done for Migration

Migration can be considered complete when all conditions below are met:

1. `dashboard` and `preferences` are fully implemented and no longer placeholders.
2. Build/lint checks pass in a reproducible environment.
3. Critical path tests are in place and passing.
4. Deployment and rollback procedures are documented and validated.
5. Canonical docs match shipped behavior.