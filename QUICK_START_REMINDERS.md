# 🚀 Quick Start: Email Reminders

## What I Just Built For You

✅ **Resend Email Integration** - Production-ready email sending  
✅ **Appointment Reminder System** - Automated 24h reminders  
✅ **Beautiful Email Templates** - Professional HTML emails  
✅ **Cron Endpoint** - `/api/cron/send-reminders` ready to schedule  
✅ **Database Schema Updates** - Tracks when reminders are sent  

---

## ⚡ 3-Step Setup

### 1. Update Local `.env`:

```bash
MAIL_DRIVER="resend"
RESEND_API_KEY="your_resend_api_key_here"
CRON_SECRET="<run: openssl rand -base64 32>"
```

### 2. Run Migration:

```bash
npx prisma migrate deploy
```

### 3. Add to Vercel:

Go to Vercel → Settings → Environment Variables → Add:
- `MAIL_DRIVER` = `resend`
- `RESEND_API_KEY` = `your_resend_api_key_here`
- `CRON_SECRET` = (the secret you generated)

---

## 🔄 Schedule the Cron

### Option A: Vercel Cron (If you have Pro plan - $20/mo)

Create `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/send-reminders",
    "schedule": "0 6 * * *"
  }]
}
```

(Runs at 9 AM Kenya time)

### Option B: Free Alternative - cron-job.org

1. Go to https://cron-job.org (free account)
2. Create cron job:
   - **URL**: `https://recro-group.vercel.app/api/cron/send-reminders`
   - **Schedule**: `0 6 * * *` (9 AM Kenya time)
   - **Method**: GET
   - **Header**: `Authorization: Bearer <YOUR_CRON_SECRET>`

---

## 📧 How It Works

```
Booking Created → Confirmation Email Sent (immediately)
        ↓
   24 hours before appointment
        ↓
Cron runs → Finds tomorrow's appointments → Sends Reminders
```

---

## 💰 Cost: FREE for Your Scale

Resend free tier: **3,000 emails/month**

Even with 1,000 appointments/month:
- 1,000 confirmations + 1,000 reminders = 2,000 emails
- Still under the free limit! ✅

---

## 🧪 Test It

1. **Create a test appointment** for tomorrow
2. **Manually trigger the cron**:
   ```bash
   curl -X POST https://recro-group.vercel.app/api/cron/send-reminders \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```
3. **Check Resend dashboard**: https://resend.com/emails

---

## 📁 Files Created/Modified

### New Files:
- `src/lib/mail/drivers/resend.ts` - Resend integration
- `src/app/api/cron/send-reminders/route.ts` - Cron endpoint
- `prisma/migrations/.../migration.sql` - Database updates
- `EMAIL_REMINDERS_SETUP.md` - Full documentation

### Modified Files:
- `src/lib/mail/index.ts` - Added resend driver
- `src/lib/mail/templates.ts` - Added reminder templates
- `prisma/schema.prisma` - Added reminder fields
- `.env.example` - Documented new variables

---

## ✅ Your Action Items

1. [ ] Generate CRON_SECRET and add to `.env`
2. [ ] Run database migration
3. [ ] Add environment variables to Vercel
4. [ ] Set up cron service (Vercel Cron or cron-job.org)
5. [ ] Test with a sample appointment
6. [ ] Push changes to Git
7. [ ] Verify emails in Resend dashboard

---

## 🆘 Need Help?

Read the full guide: `EMAIL_REMINDERS_SETUP.md`

Questions? Let me know!
