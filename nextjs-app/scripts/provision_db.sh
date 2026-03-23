#!/usr/bin/env bash
set -euo pipefail

# Provision a database using environment variables.
# Supports SQLite (local dev) and PostgreSQL (production/staging).

if [ -f .env ]; then
  # load simple KEY=VAL env file (not export-safe for complex cases)
  export $(grep -v '^#' .env | xargs)
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL not set. Please set DATABASE_URL in .env"
  echo "Examples:"
  echo "  SQLite: DATABASE_URL=\"file:./dev.db\""
  echo "  Postgres: DATABASE_URL=\"postgresql://user:pass@host:5432/dbname\""
  exit 1
fi

echo "Selecting Prisma schema based on DATABASE_URL..."

# Check if DATABASE_URL is SQLite
if echo "$DATABASE_URL" | grep -qE '^(sqlite:|file:)'; then
  echo "✓ Detected SQLite DATABASE_URL"
  echo "Copying sqlite schema to prisma/schema.prisma..."
  cp prisma/schema.sqlite.prisma prisma/schema.prisma
  
  echo "Running: npm run prisma:generate"
  npm run prisma:generate
  
  echo "Running: npm run prisma:migrate"
  npm run prisma:migrate || true

  echo "Running: npm run db:seed"
  npm run db:seed || true

  echo ""
  echo "✓ SQLite provisioning complete!"
  echo "Database file: ${DATABASE_URL#file:}"
  echo ""
  echo "Next steps:"
  echo "  - Run 'npx prisma studio' to explore your database"
  echo "  - Start building API routes in src/app/api"
  
  exit 0
fi

# PostgreSQL provisioning
echo "✓ Detected PostgreSQL DATABASE_URL"

if [ -z "${PG_SUPERUSER_URL:-}" ]; then
  echo "⚠ PG_SUPERUSER_URL not set. Assuming database already exists."
  echo "If the database doesn't exist, set PG_SUPERUSER_URL to create it."
  echo "Example: export PG_SUPERUSER_URL='postgresql://postgres:password@localhost:5432/postgres'"
else
  echo "Parsing DATABASE_URL to extract DB name..."
  DB_NAME=$(echo "$DATABASE_URL" | sed -E 's|.*\/([^\/?]+)(\?.*)?$|\1|')
  echo "Target DB: $DB_NAME"

  echo "Checking if database '$DB_NAME' exists..."
  EXISTS=$(psql "$PG_SUPERUSER_URL" -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME';" || echo "")

  if [ "x$EXISTS" = "x1" ]; then
    echo "✓ Database '$DB_NAME' already exists."
  else
    echo "Creating database '$DB_NAME'..."
    psql "$PG_SUPERUSER_URL" -v ON_ERROR_STOP=1 -c "CREATE DATABASE \"$DB_NAME\";"
    echo "✓ Database created."
  fi
fi

echo "Copying postgres schema to prisma/schema.prisma..."
cp prisma/schema.postgres.prisma prisma/schema.prisma

echo "Running: npm run prisma:generate"
npm run prisma:generate

echo "Running: npx prisma db push"
npx prisma db push

echo "Running: npm run db:seed"
npm run db:seed || true

echo ""
echo "✓ PostgreSQL provisioning complete!"
echo ""
echo "Next steps:"
echo "  1. Run 'npm run build' to verify production build"
echo "  2. Run 'npm run start' to launch on port 7676"
echo "  3. Run 'npx prisma studio' to inspect data (optional)"
