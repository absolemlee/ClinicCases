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

## 3. Database Migration

Use production-safe migration workflow (no dev reset).

Example:

```bash
npx prisma migrate deploy
```

## 4. Run

```bash
npm run start
```

## 5. Post-Deploy Checks

1. Login works
2. Session persistence works
3. Password reset emails send
4. Case creation/edit works
5. Document upload/download works
6. Journals and board render and save data

## 6. Security Checklist

- Use strong `AUTH_SECRET`
- Restrict DB credentials and network access
- Use HTTPS and correct `NEXTAUTH_URL`
- Confirm no debug-only credentials remain
