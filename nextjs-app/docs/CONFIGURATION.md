# Configuration Guide

Last updated: 2026-03-23

This guide defines required and optional configuration for ClinicCases Next.js.

## Environment Variables

Set these in `.env`.

### Required

- `DATABASE_URL`
  - Local sqlite example: `file:./dev.db`
- `AUTH_SECRET`
  - Random long secret used by Auth.js
- `NEXTAUTH_URL`
  - Local dev: `http://localhost:7676` / Production: `https://case.inspecta.pro`

### Email (Optional but Recommended)

- `RESEND_API_KEY`
  - Required to send password reset and welcome emails
- `EMAIL_FROM`
  - Example: `ClinicCases <no-reply@yourdomain.com>`

Behavior without `RESEND_API_KEY`:

- App will not send actual email.
- It logs warning/fallback behavior from `src/lib/email.ts`.

## Database Configuration

The project currently targets sqlite in `prisma/schema.prisma`.

Local dev default:

```env
DATABASE_URL="file:./dev.db"
```

For production database migration:

1. Update Prisma datasource provider and URL.
2. Regenerate Prisma client.
3. Run migrations in target environment.
4. Validate all API routes against migrated schema.

## Auth Configuration

Auth route:

- `src/app/api/auth/[...nextauth]/route.ts`

Session and permission behavior depends on user/group records in the database.

## File Upload Behavior

Document uploads are handled through API routes under:

- `src/app/api/cases/[id]/documents`

Ensure server has write permissions for configured upload locations.

## Recommended Configuration Validation

Run:

```bash
npm run prisma:generate
npm run lint
npm run build
```

Then manually validate:

1. Login flow
2. Password reset request + reset token flow
3. Case document upload/download/delete
4. Board and journal CRUD operations
