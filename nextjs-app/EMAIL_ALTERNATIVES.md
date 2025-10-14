# Email Sending Alternatives (No SMTP Required)

## Problem
Production server blocks SMTP ports (25, 587, 465), so traditional email sending won't work.

## Solutions (Ranked by Ease)

---

### ✅ **Option 1: HTTP-Based Email APIs** (RECOMMENDED)
Uses HTTPS API calls instead of SMTP - works on any server.

#### 1A. Resend (Easiest, Modern)
- **Method**: HTTPS REST API
- **Free Tier**: 3,000 emails/month (100/day)
- **Setup Time**: 15 minutes
- **Cost**: Free → $20/month (50k emails)

```bash
npm install resend
```

```typescript
// No SMTP needed - just HTTP requests
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@yourdomain.com',
  to: user.email,
  subject: 'Password Reset',
  html: emailContent
});
```

**Requirements**:
- Domain (for sender email)
- DNS TXT record (verification)
- API key

---

#### 1B. SendGrid (Popular, Reliable)
- **Method**: HTTPS REST API
- **Free Tier**: 100 emails/day forever
- **Setup Time**: 20 minutes
- **Cost**: Free → $15/month (40k emails)

```bash
npm install @sendgrid/mail
```

```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: user.email,
  from: 'noreply@yourdomain.com',
  subject: 'Password Reset',
  html: emailContent
});
```

---

#### 1C. Mailgun (Developer-Friendly)
- **Method**: HTTPS REST API
- **Free Tier**: 5,000 emails/month for 3 months
- **Setup Time**: 20 minutes
- **Cost**: $15/month (50k emails)

```bash
npm install mailgun.js form-data
```

```typescript
import Mailgun from 'mailgun.js';
import formData from 'form-data';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY
});

await mg.messages.create('yourdomain.com', {
  from: 'noreply@yourdomain.com',
  to: [user.email],
  subject: 'Password Reset',
  html: emailContent
});
```

---

#### 1D. Amazon SES (Cheapest at Scale)
- **Method**: AWS SDK (HTTPS)
- **Free Tier**: 62,000 emails/month (if hosted on AWS EC2)
- **Setup Time**: 30 minutes (more complex)
- **Cost**: $0.10 per 1,000 emails (very cheap)

```bash
npm install @aws-sdk/client-ses
```

```typescript
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const client = new SESClient({ region: 'us-east-1' });

await client.send(new SendEmailCommand({
  Source: 'noreply@yourdomain.com',
  Destination: { ToAddresses: [user.email] },
  Message: {
    Subject: { Data: 'Password Reset' },
    Body: { Html: { Data: emailContent } }
  }
}));
```

---

### ✅ **Option 2: Webhook to External Service**
If you can't install packages or use external APIs directly.

```typescript
// POST to an external email relay service
await fetch('https://your-email-relay.com/send', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${process.env.EMAIL_RELAY_KEY}` },
  body: JSON.stringify({
    to: user.email,
    subject: 'Password Reset',
    html: emailContent
  })
});
```

---

### ✅ **Option 3: Database Queue + External Processor**
For highly restricted environments.

**Flow**:
1. Next.js app saves email to database queue
2. External service (cron job, serverless function) reads queue
3. External service sends emails via any method
4. Marks as sent in database

```typescript
// In Next.js API route - just queue it
await prisma.emailQueue.create({
  data: {
    to: user.email,
    subject: 'Password Reset',
    html: emailContent,
    status: 'pending'
  }
});
```

```python
# External Python script (runs every minute)
import requests
from database import get_pending_emails

for email in get_pending_emails():
    requests.post('https://api.sendgrid.com/v3/mail/send', ...)
    mark_as_sent(email.id)
```

---

### ✅ **Option 4: Client-Side Email (User's Email Client)**
Last resort - opens user's default email client.

```typescript
// Generate mailto link
const resetUrl = `${baseUrl}/password-reset/reset?token=${resetToken}`;
const mailtoLink = `mailto:${user.email}?subject=Password Reset&body=Click here: ${resetUrl}`;

// Return link to frontend
return { mailtoLink };
```

**Pros**: No server config needed  
**Cons**: Not automated, poor UX, unreliable

---

## 🎯 **Recommendation Matrix**

| Scenario | Best Option | Why |
|----------|-------------|-----|
| **Normal deployment** | Resend or SendGrid | Easy, reliable, free tier |
| **AWS hosting** | Amazon SES | Cheapest, 62k free emails |
| **Very restricted server** | Database Queue | Emails sent by external service |
| **No budget** | SendGrid Free | 100/day forever |
| **High volume (>100k/month)** | Amazon SES | $10 per 100k emails |

---

## 🚀 **Quick Start: Resend Implementation** (RECOMMENDED)

### Step 1: Install (1 min)
```bash
cd /workspaces/ClinicCases/nextjs-app
npm install resend
```

### Step 2: Get API Key (5 mins)
1. Go to https://resend.com
2. Sign up (free)
3. Add domain or use their test domain
4. Copy API key

### Step 3: Add to Environment (1 min)
```bash
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
NEXTAUTH_URL=http://localhost:3000
```

### Step 4: Create Email Utility (5 mins)
Create `/src/lib/email.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  username: string
) {
  try {
    await resend.emails.send({
      from: 'ClinicCases <onboarding@resend.dev>', // Use resend.dev for testing
      to,
      subject: 'Password Reset Request - ClinicCases',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .button { 
                display: inline-block; 
                padding: 12px 24px; 
                background-color: #2563eb; 
                color: white; 
                text-decoration: none; 
                border-radius: 6px; 
                margin: 20px 0;
              }
              .footer { margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Password Reset Request</h2>
              <p>Hello <strong>${username}</strong>,</p>
              <p>You requested to reset your password for ClinicCases. Click the button below to proceed:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
              <p><strong>This link expires in 1 hour.</strong></p>
              <p>If you didn't request this password reset, please ignore this email or contact your administrator.</p>
              <div class="footer">
                <p>This is an automated message from ClinicCases. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
```

### Step 5: Update API Route (2 mins)
Update `/src/app/api/auth/password-reset/request/route.ts`:

```typescript
import { sendPasswordResetEmail } from '@/lib/email';

// Replace the console.log section with:
const resetUrl = `${process.env.NEXTAUTH_URL}/password-reset/reset?token=${resetToken}`;

const emailResult = await sendPasswordResetEmail(
  user.email,
  resetUrl,
  user.username
);

if (!emailResult.success) {
  console.error('Email failed to send, but continuing for security');
}

console.log(`Password reset email sent to: ${user.email}`);
```

### Step 6: Test (5 mins)
1. Start dev server: `npm run dev`
2. Go to http://localhost:3000/password-reset/request
3. Enter a real email address you control
4. Check inbox (including spam)

**Total Time: ~20 minutes**

---

## 📋 **Implementation Checklist**

- [ ] Choose email service (Resend recommended)
- [ ] Sign up and get API key
- [ ] Install package: `npm install resend`
- [ ] Add API key to `.env.local`
- [ ] Create `/src/lib/email.ts` utility
- [ ] Update password reset API route
- [ ] Test with real email address
- [ ] Configure custom domain (production only)
- [ ] Update email templates with branding
- [ ] Add error handling and logging

---

## ⚠️ **Important Notes**

1. **Domain Verification**: For production, you'll need to verify your domain with DNS records. Most services provide instructions.

2. **Testing**: Use the service's test domain (like `onboarding@resend.dev`) for development.

3. **Rate Limits**: Free tiers have daily limits (100-300/day typically). Plan accordingly.

4. **Deliverability**: HTTP APIs have better deliverability than SMTP because they handle authentication, SPF, DKIM, DMARC automatically.

5. **No Server Config Needed**: Since these use HTTPS (port 443), they work on any server, even heavily firewalled ones.

---

## 🤔 **Which Should You Choose?**

**If you want the fastest setup:** → Resend  
**If you want the most reliable:** → SendGrid  
**If you want the cheapest:** → Amazon SES  
**If server is VERY restricted:** → Database Queue  

**Would you like me to implement one of these solutions?** I recommend Resend for simplicity, but I can set up whichever fits your infrastructure best.
