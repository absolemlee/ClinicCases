# Database Setup & Usage Guide

This guide explains how to provision and use the ClinicCases database structure with Prisma.

## Overview

The database schema has been extracted from the legacy PHP codebase and mapped to Prisma models. Two schema variants are provided:

- **`prisma/schema.sqlite.prisma`** — SQLite version for local development (no external database required)
- **`prisma/schema.postgres.prisma`** — PostgreSQL version for production/staging

The provisioning script automatically selects the correct schema based on your `DATABASE_URL`.

## Quick Start (SQLite - Local Development)

**1. Copy the environment template:**

```bash
cd /workspaces/ClinicCases/nextjs-app
cp .env.example .env
```

**2. Edit `.env` and set a SQLite DATABASE_URL:**

```bash
DATABASE_URL="file:./dev.db"
```

**3. Install dependencies:**

```bash
npm install
```

**4. Run the provisioning script:**

```bash
npm run db:provision
```

This will:
- Detect the SQLite URL
- Copy `prisma/schema.sqlite.prisma` → `prisma/schema.prisma`
- Run `prisma generate` to create the Prisma Client
- Run `prisma migrate dev` to create the database and tables

**5. Verify the database:**

```bash
npx prisma studio
```

This opens a browser-based GUI to inspect your SQLite database.

---

## PostgreSQL Setup (Production/Staging)

**1. Ensure PostgreSQL is running and accessible.**

For example, using a managed service (AWS RDS, GCP Cloud SQL, Azure Database) or a local Postgres instance.

**2. Copy the environment template:**

```bash
cd /workspaces/ClinicCases/nextjs-app
cp .env.example .env
```

**3. Edit `.env` with your Postgres credentials:**

```bash
# Target database connection (the DB you want to create/use)
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/cliniccases_db"

# Superuser connection (used to CREATE the database if it doesn't exist)
PG_SUPERUSER_URL="postgresql://postgres:admin_password@localhost:5432/postgres"
```

**4. Install dependencies:**

```bash
npm install
```

**5. Run the provisioning script:**

```bash
npm run db:provision
```

This will:
- Check if the target database exists using `PG_SUPERUSER_URL`
- Create the database if missing
- Copy `prisma/schema.postgres.prisma` → `prisma/schema.prisma`
- Print next steps (you must manually run generate/migrate)

**6. Generate Prisma Client and run migrations:**

```bash
npm run prisma:generate
npm run prisma:migrate
```

**7. Verify the database:**

```bash
npx prisma studio
```

---

## Database Schema Summary

The schema includes all core ClinicCases tables:

### Core Tables

| Table | Prisma Model | Description |
|-------|-------------|-------------|
| `cm` | `Case` | Primary case records (clients, case numbers, open/close dates, etc.) |
| `cm_columns` | `CaseColumn` | Metadata for customizable case fields |
| `cm_case_notes` | `CaseNote` | Case notes with timestamps and user attribution |
| `cm_case_assignees` | `CaseAssignee` | Tracks user assignments to cases |
| `cm_contacts` | `CaseContact` | Party information (clients, witnesses, etc.) |
| `cm_documents` | `Document` | Uploaded files and document metadata |
| `cm_messages` | `Message` | Internal messaging system (inbox/threads) |
| `cm_events` | `Event` | Calendar events and tasks |
| `cm_events_responsibles` | `EventResponsible` | Users responsible for events |
| `cm_adverse_parties` | `AdverseParty` | Adverse party names for conflict checking |
| `cm_users` | `User` | User profiles, credentials, and preferences |
| `cm_groups` | `Group` | Role-based permission groups |
| `cm_case_types` | `CaseType` | Lookup table for case types |
| `cm_clinic_type` | `ClinicType` | Lookup table for clinic types |

### Key Relations

- `Case` ↔ `CaseNote` (one-to-many)
- `Case` ↔ `CaseContact` (one-to-many)
- `Case` ↔ `Document` (one-to-many)
- `Case` ↔ `CaseAssignee` (one-to-many)
- `Case` ↔ `Event` (one-to-many)
- `Event` ↔ `EventResponsible` (one-to-many)
- `Case` ↔ `Message` (one-to-many, optional)

### Data Types

- **PostgreSQL**: Uses native types (`TIMESTAMPTZ`, `TEXT`, `BOOLEAN`)
- **SQLite**: Uses compatible types (`INTEGER` for booleans, `TEXT` for large strings, `DATETIME` for timestamps)

---

## Using Prisma Client in Your App

After running `npm run prisma:generate`, you can use the Prisma Client in your Next.js API routes or server components:

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

```typescript
// app/api/cases/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const cases = await prisma.case.findMany({
    where: { deleted: false },
    include: {
      notes: true,
      assignees: true,
    },
    take: 50,
  });

  return NextResponse.json(cases);
}
```

---

## Common Operations

### Create a new case

```typescript
const newCase = await prisma.case.create({
  data: {
    firstName: 'John',
    lastName: 'Doe',
    caseNumber: '2025-001',
    dateOpen: '2025-10-14',
    openedBy: 'admin',
    caseType: 'Family Law',
  },
});
```

### Add a note to a case

```typescript
await prisma.caseNote.create({
  data: {
    caseId: 1,
    username: 'admin',
    description: 'Initial consultation completed.',
    datestamp: new Date(),
  },
});
```

### Assign a user to a case

```typescript
await prisma.caseAssignee.create({
  data: {
    caseId: 1,
    username: 'jdoe',
    status: 'active',
    dateAssigned: new Date(),
  },
});
```

### Query cases with relations

```typescript
const caseWithDetails = await prisma.case.findUnique({
  where: { id: 1 },
  include: {
    notes: { orderBy: { datestamp: 'desc' } },
    contacts: true,
    documents: true,
    assignees: { where: { status: 'active' } },
    events: { include: { responsibles: true } },
  },
});
```

---

## Troubleshooting

### Error: `prisma` command not found

Run `npm install` to ensure Prisma CLI is installed.

### Error: Database does not exist (Postgres)

Ensure `PG_SUPERUSER_URL` is set correctly and points to a superuser account that can create databases.

### Error: permission denied (Postgres)

The user in `PG_SUPERUSER_URL` must have `CREATEDB` privilege. Check with:

```sql
SELECT rolcreatedb FROM pg_roles WHERE rolname = 'your_user';
```

### SQLite file not created

Ensure the `DATABASE_URL` path is writable. Example:

```bash
DATABASE_URL="file:./dev.db"
```

The file will be created in the `nextjs-app` directory.

### Schema out of sync

If you modify the Prisma schema, regenerate the client:

```bash
npm run prisma:generate
npm run prisma:migrate
```

---

## Migration from Legacy MySQL

If you have existing MySQL data from the legacy ClinicCases installation:

1. **Export MySQL data** to SQL or CSV format
2. **Transform serialized PHP arrays** to JSON (we can provide a conversion script)
3. **Import into Postgres/SQLite** using Prisma seed scripts or direct SQL

A migration script will be provided in a future phase. For now, focus on testing the schema structure with sample data.

---

## Next Steps

1. **Seed the database** with sample data (users, groups, case types)
2. **Build API routes** in `src/app/api` to expose CRUD operations
3. **Create UI components** in `src/components` to display and edit data
4. **Implement authentication** using NextAuth.js and the `cm_users` table
5. **Add role-based authorization** using the `cm_groups` table

For questions or issues, refer to the migration playbook in `documentation/nextjs-migration-guide.md`.
