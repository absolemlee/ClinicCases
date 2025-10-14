# 🧪 Testing Password Reset Emails - Quick Guide

## ✅ Configuration Complete!

Your Resend API key has been added to `.env`:
```
RESEND_API_KEY="re_7UqUZXnQ_CYH1sa7zpmgN1L7aueo2AY1z"
EMAIL_FROM="ClinicCases <onboarding@resend.dev>"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 🚀 Test Instructions

### Step 1: Access Password Reset Page

The dev server is running. Open your browser and go to:

**URL**: http://localhost:3001/password-reset/request

(Note: Using port 3001 because 3000 was in use)

### Step 2: Request Password Reset

1. Enter a **real email address you control** (to verify the email arrives)
2. Click **"Send Reset Instructions"**
3. You should see a success message

### Step 3: Check Your Email

1. **Check your inbox** for an email from ClinicCases
2. **Subject**: "Password Reset Request - ClinicCases"
3. **From**: ClinicCases <onboarding@resend.dev>
4. **Check spam folder** if you don't see it within 1-2 minutes

### Step 4: Test the Reset Link

1. Open the email
2. Click the **"Reset My Password"** button
3. You should be taken to the password reset form
4. Enter a new password (min 8 characters)
5. Confirm the password
6. Click **"Reset Password"**
7. You should see success and be redirected to login

---

## 🎯 What to Verify

- [ ] Email arrives within 1-2 minutes
- [ ] Email has professional design (blue header, button)
- [ ] Email is mobile-responsive
- [ ] Reset link works when clicked
- [ ] Password reset completes successfully
- [ ] Can log in with new password
- [ ] Link expires after 1 hour (optional test)
- [ ] Link only works once (optional test)

---

## 🐛 Troubleshooting

### Email Not Arriving?

**Check server console** for error messages:
```bash
# Look for these messages in the terminal:
✅ "Password reset email sent successfully to: your@email.com"
❌ "Failed to send password reset email: [error]"
```

**Check Resend Dashboard**:
1. Go to https://resend.com/emails
2. Look for your sent email
3. Check delivery status

### Common Issues

**Issue**: "Email service not configured" error
- **Fix**: API key might not be loaded. Restart dev server.

**Issue**: Email in spam folder
- **Fix**: This is normal for development. Add sender to contacts.

**Issue**: "Invalid reset token" error
- **Fix**: Token might have expired (1 hour limit). Request new reset.

---

## 📊 Expected Server Output

When you request a password reset, you should see in the terminal:

```
✅ Password reset email sent successfully to: your@email.com
```

When the email is sent via Resend API, you'll also see Resend's response with the email ID.

---

## 🎨 Email Preview

You should receive an email that looks like:

```
┌─────────────────────────────────────┐
│   🔒 ClinicCases                    │ ← Blue gradient
├─────────────────────────────────────┤
│  Password Reset Request             │
│                                     │
│  Hello [username],                  │
│                                     │
│  We received a request to reset     │
│  your password...                   │
│                                     │
│  ┌──────────────────┐              │
│  │ Reset My Password │              │ ← Blue button
│  └──────────────────┘              │
│                                     │
│  [Reset link]                       │
│                                     │
│  ⏰ This link expires in 1 hour     │
└─────────────────────────────────────┘
```

---

## ✅ Success Criteria

**Email Integration is SUCCESSFUL if:**
1. ✅ Email arrives in your inbox
2. ✅ Email has professional HTML design
3. ✅ Reset button/link works
4. ✅ Password reset completes
5. ✅ Can log in with new password

**If all 5 pass** → Email integration is 100% production-ready! 🎉

---

## 📝 Next Steps After Testing

Once you confirm emails are working:

1. **Mark Phase 1 complete** ✅
2. **Choose next priority**:
   - Phase 2: Testing Infrastructure
   - Phase 3: Production Deployment Prep
   - Phase 4: Bug Fixes & Polish

---

## 🔗 Quick Links

- **Password Reset Request**: http://localhost:3001/password-reset/request
- **Login Page**: http://localhost:3001/login
- **Resend Dashboard**: https://resend.com/emails

---

**Ready to test?** Go to http://localhost:3001/password-reset/request and let's see those emails! 📧
