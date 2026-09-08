# 📧 Email Appointment Reminders Setup Guide

## Overview

Your therapy booking system now has automated email reminders! Users will receive:
- ✅ **Confirmation email** when they book an appointment
- ✅ **Reminder email** 24 hours before their appointment
- ✅ **Beautiful HTML templates** with appointment details

---

## 🚀 Quick Start

### Step 1: Update Environment Variables

Add these to your `.env` file (and Vercel):

```bash
# Use Resend for production emails
MAIL_DRIVER="resend"

# Your Resend API key (already have it!)
RESEND_API_KEY="re_xxxxxxxx"

# Generate a secret for cron protection
CRON_SECRET="<generate-with-openssl-rand-base64-32>"
```

###Step 2: Run Database Migration

```bash
# Run the migration to add reminder fields
npx prisma migrate deploy

# Or for development
npx prisma migrate dev
```

### Step 3: Configure Vercel Cron

Create `vercel.json` in your project root:

```json
{
  "crons": [{
    "path": "/api/cron/send-reminders",
    "schedule": "0 9 * * *"
  }]
}
```

This runs daily at 9:00 AM UTC (check timezone for your location).

---

## 📋 Email Service Comparison

| Service | Free Tier | Paid Plans | Best For |
|---------|-----------|------------|----------|
| **Resend** ✅ | 3,000/month, 100/day | $20/mo for 50k | Your use case |
| **SendGrid** | 100/day | $15/mo for 50k | Established |
| **Mailgun** | 5,000/month (trial) | $35/mo for 50k | High volume |
| **AWS SES** | 3,000/month (free tier) | $0.10/1k | Technical |
| **Postmark** | 100/month trial | $15/mo for 10k | Transactional |

**Recommendation: Stick with Resend** ✅

---

## 🎯 How It Works

### 1. Cron Job (`/api/cron/send-reminders`)
- Runs daily (configured in Vercel Cron)
- Finds appointments scheduled for tomorrow
- Sends reminder emails
- Tracks when reminders are sent

### 2. Email Templates
Located in `src/lib/mail/templates.ts`:
- `appointmentReminderEmail()` - 24h before appointment
- `appointmentConfirmationEmail()` - When booking confirmed

### 3. Mail System
Located in `src/lib/mail/`:
- Supports multiple drivers (console, resend)
- Easy to switch between providers
- Structured email sending

---

## 🔧 Vercel Setup

### Add Environment Variables to Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables

2. Add for **Production**:
   ```
   MAIL_DRIVER=resend
   RESEND_API_KEY=re_xxxxxxxx
   CRON_SECRET=<your-generated-secret>
   ```

3. Redeploy your application

### Set Up Vercel Cron:

Create `vercel.json` in your project root:

```json
{
  "crons": [{
    "path": "/api/cron/send-reminders",
    "schedule": "0 9 * * *"
  }]
}
```

**Note:** Vercel Cron is only available on Pro plans ($20/month).

---

## 🆓 Alternative: Free Cron Services

If you don't have Vercel Pro, use a free cron service:

### Option 1: cron-job.org (Recommended)

1. Go to: https://cron-job.org
2. Sign up for free
3. Create a new cron job:
   - **URL**: `https://recro-group.vercel.app/api/cron/send-reminders`
   - **Schedule**: Daily at 9:00 AM
   - **HTTP Method**: GET
   - **HTTP Header**: `Authorization: Bearer <YOUR_CRON_SECRET>`

### Option 2: EasyCron

1. Go to: https://www.easycron.com
2. Free plan: 30 cron jobs
3. Configure same as above

### Option 3: GitHub Actions

Create `.github/workflows/send-reminders.yml`:

```yaml
name: Send Appointment Reminders

on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
  workflow_dispatch:  # Manual trigger

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Reminder Endpoint
        run: |
          curl -X POST https://recro-group.vercel.app/api/cron/send-reminders \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

Then add `CRON_SECRET` to GitHub repository secrets.

---

## 🧪 Testing

### Test the Cron Endpoint Locally:

```bash
# Generate a CRON_SECRET
export CRON_SECRET=$(openssl rand -base64 32)

# Add to your .env
echo "CRON_SECRET=$CRON_SECRET" >> .env

# Start your dev server
npm run dev

# Test the endpoint
curl -X POST http://localhost:3000/api/cron/send-reminders \
  -H "Authorization: Bearer $CRON_SECRET"
```

### Test Email Sending:

Create a test appointment for tomorrow and run the cron manually.

---

## 📊 Monitoring

### Check Logs in Vercel:

1. Go to your project dashboard
2. Click **Deployments** → Select deployment
3. Click **Runtime Logs**
4. Search for `[cron/reminders]`

### Resend Dashboard:

1. Go to: https://resend.com/emails
2. View all sent emails
3. Check delivery status
4. View email content

---

## 🔐 Security

### Protect Cron Endpoint:

Always set `CRON_SECRET` in production:

```bash
# Generate a strong secret
openssl rand -base64 32

# Add to Vercel environment variables
CRON_SECRET="your-generated-secret"
```

The endpoint will return 401 Unauthorized without the correct token.

---

## 📧 Email Customization

### Modify Templates:

Edit `src/lib/mail/templates.ts`:

```typescript
export function appointmentReminderEmail(data: {
  customerName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  // Add more fields as needed
}) {
  // Customize email content here
}
```

### Change Email Sender:

Update in `.env`:

```bash
MAIL_FROM="Recro Group <appointments@recrogroup.org>"
```

---

## 💰 Cost Estimates

### Resend Pricing:

- **Free**: 3,000 emails/month (100/day) - Perfect for starting out
- **Pro**: $20/month for 50,000 emails
- **Growth**: $80/month for 500,000 emails

### Example Calculations:

**Small Practice (50 appointments/month):**
- 50 confirmation emails
- 50 reminder emails  
- **Total**: 100 emails/month = **FREE** ✅

**Medium Practice (300 appointments/month):**
- 300 confirmation emails
- 300 reminder emails
- **Total**: 600 emails/month = **FREE** ✅

**Large Practice (2,000 appointments/month):**
- 2,000 confirmation emails
- 2,000 reminder emails
- **Total**: 4,000 emails/month = **PRO Plan** ($20/mo)

---

## 🚨 Troubleshooting

### Emails Not Sending?

1. Check `MAIL_DRIVER=resend` in environment variables
2. Verify `RESEND_API_KEY` is correct
3. Check Resend dashboard for errors
4. Look at Vercel runtime logs

### Cron Not Running?

1. Verify `vercel.json` is in project root
2. Check Vercel plan (Cron requires Pro)
3. Use alternative cron service (cron-job.org)
4. Check cron job logs in service dashboard

### Wrong Timezone?

The cron runs in UTC. Convert your local time:
- 9 AM Kenya (EAT = UTC+3) → Schedule at `0 6 * * *`
- 9 AM UK (GMT) → Schedule at `0 9 * * *`
- 9 AM US Eastern → Schedule at `0 14 * * *`

---

## ✅ Checklist

- [ ] Resend API key added to `.env` and Vercel
- [ ] `MAIL_DRIVER=resend` set in environment
- [ ] `CRON_SECRET` generated and added
- [ ] Database migration run
- [ ] `vercel.json` created with cron schedule
- [ ] Cron endpoint tested locally
- [ ] Production deployment complete
- [ ] Cron service configured (Vercel Cron or alternative)
- [ ] Test appointment created for tomorrow
- [ ] Reminder email received successfully

---

## 📚 Next Steps

1. **Verify Resend account**: Ensure your domain is verified
2. **Customize templates**: Match your brand colors and style
3. **Add more reminders**: 1 week before, 1 hour before
4. **SMS reminders**: Integrate Africa's Talking or Twilio
5. **Analytics**: Track open rates in Resend dashboard

---

## 🆘 Support

Need help? Check:
- Resend docs: https://resend.com/docs
- Vercel Cron docs: https://vercel.com/docs/cron-jobs
- Your implementation: `src/lib/mail/` and `src/app/api/cron/`

