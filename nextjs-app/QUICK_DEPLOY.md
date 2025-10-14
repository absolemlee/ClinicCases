# ⚡ Quick Deploy to Production - 30 Minutes

This is the fast-track guide. For detailed information, see `DEPLOYMENT.md`.

---

## 🎯 **What You'll Deploy**

A fully functional case management system with:
- User/Group management
- Case tracking with documents
- Journals and messaging
- Password reset emails
- Mobile-responsive UI

---

## 🚀 **Fastest Path: Vercel + Neon**

**Why This Combo?**
- Both have generous free tiers
- Zero server configuration
- Deploys in ~30 minutes
- HTTPS automatic
- Perfect for getting started

---

## 📝 **Step-by-Step (30 Minutes)**

### **Step 1: Prepare Code** (5 min)

```bash
cd /workspaces/ClinicCases

# Make sure everything is saved
git add .
git commit -m "Ready for production deployment"
git push origin master
```

---

### **Step 2: Set Up Database** (10 min)

1. Go to **https://neon.tech**
2. Sign up (free)
3. Click **"Create Project"**
4. Name it: `cliniccases`
5. Choose region (closest to your users)
6. **Copy the connection string** (looks like):
   ```
   postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb
   ```
7. Save it somewhere safe!

---

### **Step 3: Deploy to Vercel** (10 min)

1. Go to **https://vercel.com**
2. Click **"Add New..."** → **"Project"**
3. Import from GitHub:
   - Connect GitHub
   - Select `ClinicCases` repository
   
4. **Configure Project**:
   - Framework: Next.js (auto-detected ✅)
   - Root Directory: `nextjs-app`
   - Leave build settings as default

5. **Add Environment Variables** (CRITICAL!):
   
   Click **"Environment Variables"** tab and add these **ONE BY ONE**:

   ```
   Key: DATABASE_URL
   Value: <paste your Neon connection string>
   ```

   ```
   Key: NEXTAUTH_SECRET
   Value: <run in terminal: openssl rand -base64 32>
   ```

   ```
   Key: NEXTAUTH_URL
   Value: https://your-app.vercel.app
   (Note: Update this after you see your app URL)
   ```

   ```
   Key: RESEND_API_KEY
   Value: re_7UqUZXnQ_CYH1sa7zpmgN1L7aueo2AY1z
   ```

   ```
   Key: EMAIL_FROM
   Value: ClinicCases <onboarding@resend.dev>
   ```

   ```
   Key: NODE_ENV
   Value: production
   ```

6. Click **"Deploy"**

7. ⏳ Wait 2-3 minutes...

8. 🎉 **You'll get a URL!** (like `https://clinic-cases-xyz.vercel.app`)

---

### **Step 4: Run Database Migrations** (5 min)

Your database is empty! Let's set it up:

```bash
# In your local terminal
cd /workspaces/ClinicCases/nextjs-app

# Set production database URL temporarily
export DATABASE_URL="<your-neon-connection-string>"

# Run migrations
npx prisma migrate deploy

# Seed with initial data (admin user, etc.)
npx prisma db seed
```

**Default Admin Login** (after seeding):
- Username: `admin`
- Password: `admin`

⚠️ **CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!**

---

### **Step 5: Update NEXTAUTH_URL** (2 min)

1. Go back to Vercel dashboard
2. Click your project → **"Settings"** → **"Environment Variables"**
3. Find `NEXTAUTH_URL`
4. Click **"Edit"**
5. Update to your actual Vercel URL: `https://your-actual-url.vercel.app`
6. Click **"Save"**
7. Click **"Redeploy"** (top right)

---

### **Step 6: Test Your Deployment** (5 min)

Visit your URL: `https://your-app.vercel.app`

✅ **Test Checklist**:
- [ ] Homepage loads
- [ ] Login with `admin` / `admin`
- [ ] Create a new case
- [ ] Upload a document
- [ ] Go to password reset page
- [ ] Request reset with your real email
- [ ] Check email arrives

---

## ✅ **You're Live!**

### **What's Working:**
- ✅ Full case management
- ✅ User authentication
- ✅ Document uploads
- ✅ Password reset emails
- ✅ HTTPS automatic
- ✅ Global CDN

### **Free Tier Limits:**
- Vercel: Unlimited hobby projects
- Neon: 3GB database, 100 hours/month compute
- Resend: 3,000 emails/month

**Good for**: Up to ~50 active users

---

## 🔒 **Security: First 24 Hours**

Do these ASAP:

1. **Change admin password**:
   ```
   Login → Profile → Change Password
   ```

2. **Update email domain** (when ready):
   - Verify your domain in Resend
   - Update `EMAIL_FROM` env variable
   - Redeploy

3. **Monitor errors**:
   - Check Vercel dashboard → Analytics
   - Look for 500 errors

---

## 📱 **Custom Domain** (Optional)

Want `cliniccases.yourdomain.com` instead of `.vercel.app`?

1. Vercel Dashboard → Your Project → **"Settings"** → **"Domains"**
2. Add your domain
3. Add DNS records (Vercel tells you exactly what)
4. Wait 5 minutes
5. Update `NEXTAUTH_URL` environment variable
6. Redeploy

---

## 🆘 **Troubleshooting**

### Build Failed
- Check Vercel build logs
- Verify root directory is `nextjs-app`
- Check all environment variables are set

### Can't Login
- Verify database migrations ran
- Check `DATABASE_URL` is correct
- Run seed script again

### Email Not Sending
- Check `RESEND_API_KEY` is set
- Verify API key is valid at https://resend.com
- Check server logs for error messages

### "Internal Server Error"
- Check Vercel → Functions → Logs
- Look for red error messages
- Usually a database connection issue

---

## 📞 **Getting Help**

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- GitHub Issues: Create issue in your repo

---

## 🎯 **What's Next?**

After deployment:

1. **Week 1**: Monitor for issues, gather user feedback
2. **Week 2**: Fix bugs, improve UX (Phase 4)
3. **Month 1**: Add documentation (Phase 5)
4. **Future**: Add advanced features (Phase 6)

---

## 💰 **Cost Tracking**

**Month 1** (Free Tier):
- Vercel: $0
- Neon: $0
- Resend: $0
- **Total: $0/month**

**When to Upgrade**:
- >3GB database → Neon Pro ($19/month)
- >3,000 emails → Resend Pro ($20/month)
- >100 users → Vercel Pro ($20/month)

---

**Need help with deployment?** Tell me:
1. Which step you're on
2. What error you're seeing
3. What you've tried

I'll help you debug! 🚀
