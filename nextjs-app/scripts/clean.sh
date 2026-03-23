#!/usr/bin/env bash
set -euo pipefail

# Clean script: Remove database, dependencies, and build artifacts
# This prepares the project for a completely fresh install

echo "🧹 Cleaning ClinicCases Next.js project..."
echo ""

# Remove node_modules
if [ -d "node_modules" ]; then
  echo "Removing node_modules..."
  rm -rf node_modules
  echo "✓ node_modules removed"
else
  echo "✓ node_modules already absent"
fi

# Remove build artifacts
if [ -d ".next" ]; then
  echo "Removing .next build directory..."
  rm -rf .next
  echo "✓ .next removed"
else
  echo "✓ .next already absent"
fi

# Remove Prisma generated client
if [ -d "node_modules/@prisma" ]; then
  echo "Note: Prisma client will be regenerated on next install"
fi

# Remove SQLite database
if [ -f "dev.db" ]; then
  echo "Removing SQLite database (dev.db)..."
  rm -f dev.db
  echo "✓ dev.db removed"
else
  echo "✓ dev.db already absent"
fi

# Remove SQLite WAL/SHM files (SQLite temporary files)
if [ -f "dev.db-shm" ]; then
  rm -f dev.db-shm
fi
if [ -f "dev.db-wal" ]; then
  rm -f dev.db-wal
fi

# Remove .env if desired (optional, commented out)
# If using PostgreSQL on VPS, you typically want to keep .env
# Uncomment below if you want a completely blank slate:
# if [ -f ".env" ]; then
#   echo "Removing .env..."
#   rm -f .env
#   echo "✓ .env removed"
# fi

# Reset migrations for SQLite (optional, only if switching back to SQLite)
# Uncomment below if you're resetting to SQLite and want fresh migrations:
# if [ -d "prisma/migrations" ]; then
#   echo "Backing up and clearing migrations..."
#   mkdir -p prisma/migrations.backup
#   cp -r prisma/migrations/* prisma/migrations.backup/ 2>/dev/null || true
#   rm -rf prisma/migrations
#   echo "✓ migrations reset (backup in prisma/migrations.backup/)"
# fi

echo ""
echo "✅ Clean complete!"
echo ""
echo "Next steps:"
echo "  1. npm install"
echo "  2. npm run db:provision"
echo "  3. npm run build"
echo "  4. npm run dev  (or npm run start for production)"
