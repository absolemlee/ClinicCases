# 🚀 Production Deployment Guide - ClinicCases

**Goal**: Get ClinicCases deployed to production quickly and safely.

**Estimated Time**: 4-6 hours (depending on hosting platform)

---

## 📋 Pre-Deployment Checklist

Before deploying, verify these are complete:

- [x] Application builds successfully (`npm run build`)
- [x] Email integration configured (Resend API key)
- [x] Authentication working (Auth.js with JWT)
- [x] All core features functional
- [ ] Database migration plan (SQLite → PostgreSQL)
- [ ] Environment variables documented
- [ ] Security review completed
- [ ] Backup strategy defined
- [ ] Monitoring configured

---

## 🎯 Deployment Options (Choose One)

### Option A: Vercel (Easiest - Recommended)
**Time**: 1-2 hours | **Cost**: Free tier available | **Best for**: Quick deployment, auto-scaling

### Option B: AWS (EC2 + RDS)
**Time**: 3-4 hours | **Cost**: ~$20-50/month | **Best for**: Full control, compliance needs

### Option C: DigitalOcean (App Platform)
**Time**: 2-3 hours | **Cost**: $12+/month | **Best for**: Balance of ease and control

### Option D: Self-Hosted (VPS)
**Time**: 4-6 hours | **Cost**: $5-20/month | **Best for**: Maximum control, existing infrastructure

---

## 🚀 Quick Start: Vercel Deployment (Recommended)

### Why Vercel?
- ✅ Built for Next.js (same company)
- ✅ Zero configuration needed
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free tier (good for small teams)
- ✅ Easy rollbacks
- ✅ Built-in monitoring

### Step 1: Prepare Your Repository (5 minutes)

```bash
# Make sure everything is committed
cd /workspaces/ClinicCases
git add .
git commit -m "Prepare for production deployment"
git push origin master
```

### Step 2: Set Up PostgreSQL Database (15 minutes)

**Option 2A: Vercel Postgres** (Easiest)
- Go to Vercel dashboard → Storage → Create Database → Postgres
- Copy connection string

**Option 2B: Neon** (Free tier, serverless)
- Sign up at https://neon.tech
- Create project
- Copy connection string

**Option 2C: Railway** (Good free tier)
- Sign up at https://railway.app
- Create PostgreSQL database
- Copy connection string

### Step 3: Deploy to Vercel (10 minutes)

1. **Sign up/Login**: https://vercel.com
2. **Import Project**: 
   - Click "Add New..." → "Project"
   - Import from GitHub (connect your repo)
   - Select `ClinicCases` repository
   
3. **Configure Build**:
   - Framework Preset: Next.js ✅ (auto-detected)
   - Root Directory: `nextjs-app`
   - Build Command: `npm run build`
   - Output Directory: `.next` (auto)

4. **Environment Variables** (CRITICAL):
   Click "Environment Variables" and add these:

   ```bash
   # Database (use your PostgreSQL connection string)
   DATABASE_URL=postgresql://user:password@host:5432/database
   
   # Auth (generate new secret for production!)
   NEXTAUTH_SECRET=<run: openssl rand -base64 32>
   NEXTAUTH_URL=https://your-app.vercel.app
   
   # Email (Resend)
   RESEND_API_KEY=re_7UqUZXnQ_CYH1sa7zpmgN1L7aueo2AY1z
   EMAIL_FROM=ClinicCases <noreply@yourdomain.com>
   
   # Optional
   NODE_ENV=production
   ```

5. **Deploy**: Click "Deploy"

### Step 4: Run Database Migrations (5 minutes)

After first deploy:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
cd /workspaces/ClinicCases/nextjs-app
vercel link

# Run migrations on production database
vercel env pull .env.production
DATABASE_URL="your-prod-db-url" npx prisma migrate deploy
DATABASE_URL="your-prod-db-url" npx prisma db seed
```

### Step 5: Verify Deployment (10 minutes)

Test these critical paths:

- [ ] Homepage loads
- [ ] Login works
- [ ] Create a case
- [ ] Upload a document
- [ ] Send a message
- [ ] Request password reset (check email arrives)
- [ ] Check mobile responsiveness

---

## 📊 Database Migration: SQLite → PostgreSQL

### Why PostgreSQL for Production?

- ✅ Concurrent connections (SQLite = 1 writer)
- ✅ Better performance at scale
- ✅ ACID compliance
- ✅ Backup/replication tools
- ✅ Industry standard

### Migration Steps

#### Step 1: Export SQLite Data (if you have existing data)

```bash
cd /workspaces/ClinicCases/nextjs-app

# Export current data
npx prisma db pull
npx tsx scripts/export-data.ts > data-backup.json
```

#### Step 2: Update DATABASE_URL

```bash
# Production .env
DATABASE_URL="postgresql://username:password@host:5432/cliniccases"
```

#### Step 3: Run Migrations

```bash
# Generate Prisma client for PostgreSQL
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data
npx prisma db seed
```

#### Step 4: Import Data (if migrating existing)

```bash
npx tsx scripts/import-data.ts < data-backup.json
```

### Migration Script (Create if needed)

Create `/scripts/export-data.ts`:

```typescript
import { prisma } from '../src/lib/prisma';

async function exportData() {
  const users = await prisma.user.findMany();
  const cases = await prisma.case.findMany();
  const groups = await prisma.group.findMany();
  // ... export all tables
  
  console.log(JSON.stringify({ users, cases, groups }, null, 2));
}

exportData();
```

---

## 🔒 Security Checklist

### Critical Security Items

- [ ] **New NEXTAUTH_SECRET** generated for production
- [ ] **HTTPS only** (Vercel does this automatically)
- [ ] **Environment variables** not in git (check `.gitignore`)
- [ ] **Database** has strong password
- [ ] **Resend domain** verified (not using test domain)
- [ ] **CORS** configured if needed
- [ ] **Rate limiting** on auth endpoints (optional but recommended)

### Recommended Security Headers

Add to `next.config.mjs`:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

---

## 📧 Email Configuration for Production

### Update Resend for Production Domain

1. **Verify Your Domain** in Resend:
   - Go to https://resend.com/domains
   - Add your domain (e.g., `yourdomain.com`)
   - Add DNS records (provided by Resend):
     ```
     TXT @ v=spf1 include:resend.com ~all
     TXT resend._domainkey <value-from-resend>
     ```

2. **Update EMAIL_FROM**:
   ```bash
   EMAIL_FROM="ClinicCases <noreply@yourdomain.com>"
   ```

3. **Test Email Sending** after deployment

---

## 💾 Backup Strategy

### Automated Daily Backups

**Option A: Vercel Postgres** (Built-in backups)
- Automatic daily backups
- Point-in-time recovery
- No setup needed

**Option B: PostgreSQL Backups** (Self-managed)

Create backup script:

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="cliniccases"

# Backup database
pg_dump $DATABASE_URL > $BACKUP_DIR/db_backup_$DATE.sql

# Backup uploads folder
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz ../uploads/

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

Schedule with cron:
```bash
0 2 * * * /path/to/backup.sh
```

---

## 📁 File Upload Storage

### Current: Local File System
- Works for small deployments
- Files in `../uploads/` directory

### Production Options:

**Option A: Keep Local Storage**
- Mount persistent volume on server
- Simple, no external dependencies

**Option B: AWS S3** (Recommended for scale)
- Unlimited storage
- Global CDN
- Cost: ~$0.023 per GB/month

**Option C: Cloudinary**
- Free tier: 25GB
- Automatic image optimization
- Easy integration

### Quick S3 Setup (Optional)

1. Create S3 bucket
2. Install AWS SDK: `npm install @aws-sdk/client-s3`
3. Update document upload to use S3
4. Environment variables:
   ```bash
   AWS_ACCESS_KEY_ID=xxx
   AWS_SECRET_ACCESS_KEY=xxx
   AWS_S3_BUCKET=cliniccases-uploads
   AWS_REGION=us-east-1
   ```

---

## 📊 Monitoring & Logging

### Built-in Vercel Analytics
- Automatic performance monitoring
- Error tracking
- Usage metrics

### Recommended Add-ons:

**Sentry** (Error Tracking)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Logtail** (Log Management)
```bash
npm install @logtail/node
```

**Better Stack** (Uptime Monitoring)
- Free plan: 1 monitor
- SMS/email alerts

---

## 🚦 Go-Live Checklist

### Pre-Launch (1 hour before)

- [ ] Run final build: `npm run build`
- [ ] Database backup created
- [ ] Environment variables verified
- [ ] Email sending tested
- [ ] Login tested with test user
- [ ] Password reset tested
- [ ] Mobile view tested
- [ ] HTTPS working
- [ ] Custom domain configured (if applicable)

### Launch

- [ ] Deploy to production
- [ ] Run database migrations
- [ ] Verify homepage loads
- [ ] Test critical user flows
- [ ] Monitor error logs (first 30 minutes)

### Post-Launch (First 24 hours)

- [ ] Monitor performance
- [ ] Check error rates
- [ ] Verify email delivery
- [ ] Test from different devices
- [ ] Document any issues
- [ ] Plan hotfixes if needed

---

## 🆘 Rollback Plan

If something goes wrong:

### Vercel Rollback (Instant)
1. Go to Vercel dashboard
2. Click "Deployments"
3. Find previous working deployment
4. Click "⋯" → "Promote to Production"
5. Done in 30 seconds!

### Database Rollback
```bash
# Restore from backup
psql $DATABASE_URL < backup_file.sql
```

---

## 📈 Scaling Considerations

### Current Capacity
- Vercel free tier: Good for ~100 concurrent users
- PostgreSQL: Depends on provider plan

### When to Scale Up

**Upgrade Vercel** ($20/month) if:
- >1000 requests/day
- Need team collaboration
- Want advanced analytics

**Upgrade Database** if:
- >10GB data
- >100 concurrent connections
- Need replication

### Performance Optimization

Already implemented:
- ✅ Static page generation
- ✅ API route caching
- ✅ Image optimization (Next.js)
- ✅ Code splitting

Future optimizations:
- Edge caching (Vercel Edge Functions)
- Database connection pooling (PgBouncer)
- Redis for sessions (optional)

---

## 💰 Cost Estimate

### Free Tier (Suitable for small teams)
- Vercel: Free (Hobby plan)
- Neon PostgreSQL: Free (3GB)
- Resend: Free (3,000 emails/month)
- **Total: $0/month**

### Small Production (~50 users)
- Vercel: $20/month (Pro)
- PostgreSQL: $25/month (Neon Pro or Railway)
- Resend: $20/month (50k emails)
- **Total: ~$65/month**

### Medium Production (~200 users)
- Vercel: $20/month
- PostgreSQL: $50/month (larger instance)
- Resend: $80/month (100k emails)
- S3 Storage: $5/month
- **Total: ~$155/month**

---

## 🎯 Next Steps After Deployment

1. **Monitor for 48 hours** - Watch for errors
2. **User testing** - Have real users try it
3. **Document issues** - Track bugs/improvements
4. **Phase 4: Bug Fixes** - Polish based on feedback
5. **Phase 5: Documentation** - User manual, admin guide

---

## 📞 Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Support**: https://vercel.com/support
- **Prisma Docs**: https://www.prisma.io/docs
- **Resend Docs**: https://resend.com/docs

---

**Ready to start deploying?** Tell me which hosting option you want to use and I'll guide you through the specific steps! 🚀
