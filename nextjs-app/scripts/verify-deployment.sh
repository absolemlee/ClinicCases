#!/bin/bash
# Pre-Deployment Verification Script
# Run this before deploying to production

set -e  # Exit on error

echo "🚀 ClinicCases Pre-Deployment Verification"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check 1: Build succeeds
echo "✓ Checking build..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    ((ERRORS++))
fi

# Check 2: Environment file exists
echo "✓ Checking environment configuration..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ .env file exists${NC}"
    
    # Check for required variables
    if grep -q "DATABASE_URL" .env; then
        echo -e "${GREEN}  ✓ DATABASE_URL configured${NC}"
    else
        echo -e "${RED}  ✗ DATABASE_URL missing${NC}"
        ((ERRORS++))
    fi
    
    if grep -q "NEXTAUTH_SECRET" .env || grep -q "AUTH_SECRET" .env; then
        echo -e "${GREEN}  ✓ AUTH_SECRET configured${NC}"
    else
        echo -e "${RED}  ✗ NEXTAUTH_SECRET/AUTH_SECRET missing${NC}"
        ((ERRORS++))
    fi
    
    if grep -q "RESEND_API_KEY" .env; then
        echo -e "${GREEN}  ✓ RESEND_API_KEY configured${NC}"
    else
        echo -e "${YELLOW}  ⚠ RESEND_API_KEY missing (email won't work)${NC}"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}✗ .env file not found${NC}"
    ((ERRORS++))
fi

# Check 3: Node modules installed
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}✗ node_modules missing - run: npm install${NC}"
    ((ERRORS++))
fi

# Check 4: Prisma client generated
echo "✓ Checking Prisma..."
if [ -d "node_modules/.prisma" ]; then
    echo -e "${GREEN}✓ Prisma client generated${NC}"
else
    echo -e "${YELLOW}⚠ Prisma client not generated - run: npx prisma generate${NC}"
    ((WARNINGS++))
fi

# Check 5: Git status
echo "✓ Checking git status..."
if [ -d ".git" ]; then
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "${GREEN}✓ No uncommitted changes${NC}"
    else
        echo -e "${YELLOW}⚠ You have uncommitted changes${NC}"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠ Not a git repository${NC}"
    ((WARNINGS++))
fi

# Check 6: Package.json scripts
echo "✓ Checking package.json scripts..."
if grep -q '"build":' package.json; then
    echo -e "${GREEN}✓ Build script exists${NC}"
else
    echo -e "${RED}✗ Build script missing in package.json${NC}"
    ((ERRORS++))
fi

# Check 7: TypeScript errors
echo "✓ Checking TypeScript..."
if npx tsc --noEmit > /dev/null 2>&1; then
    echo -e "${GREEN}✓ No TypeScript errors${NC}"
else
    echo -e "${YELLOW}⚠ TypeScript errors found (build may still succeed)${NC}"
    ((WARNINGS++))
fi

# Summary
echo ""
echo "=========================================="
echo "Summary:"
echo -e "  Errors: ${RED}$ERRORS${NC}"
echo -e "  Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Ready for deployment!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Commit and push your code"
    echo "  2. Set up PostgreSQL database"
    echo "  3. Configure environment variables on hosting platform"
    echo "  4. Deploy!"
    echo ""
    echo "See DEPLOYMENT.md for detailed instructions."
    exit 0
else
    echo -e "${RED}✗ Fix errors before deploying${NC}"
    exit 1
fi
