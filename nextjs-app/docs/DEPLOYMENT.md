# Deployment Guide (Baseline)

Last updated: 2026-03-23

This is a minimal deployment baseline. Extend for your infrastructure.

## 1. Environment

Set production env vars:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXTAUTH_URL`
- `RESEND_API_KEY` (recommended)
- `EMAIL_FROM` (recommended)

## 2. Install and Build

```bash
npm ci
npm run prisma:generate
npm run build
```

## 3. Database Schema Sync

For the current PostgreSQL flow in this project, apply schema changes with:

```bash
npx prisma db push
npm run db:seed
```

## 4. Run

```bash
npm run start
```

## 5. Post-Deploy Checks

1. DNS resolves: `dig case.inspecta.pro`
2. Login works
3. Session persistence works
4. Password reset emails send
5. Case creation/edit works
6. Document upload/download works
7. Journals and board render and save data

## 6. Security Checklist

- Use strong `AUTH_SECRET`
- Restrict DB credentials and network access
- Use HTTPS and correct `NEXTAUTH_URL`
- Confirm no debug-only credentials remain
