# Grief Camp Flyer Upload Feature

## Overview
This feature allows administrators to upload a downloadable grief camp flyer (image or PDF) from the dashboard, which will be automatically displayed on the public grief camp page.

## Features
- ✅ Upload images (JPEG, PNG, WebP) or PDF files
- ✅ Maximum file size: 10MB
- ✅ Files stored in Vercel Blob storage
- ✅ Preview uploaded images in dashboard
- ✅ Automatic update on public page
- ✅ Admin-only access control

## User Flow

### Admin Dashboard (`/dashboard/programs`)
1. Navigate to `/dashboard/programs`
2. See the "Grief Camp 2027 Flyer" upload section at the top
3. Click to upload a new flyer (or replace existing)
4. Preview current flyer if one exists
5. Download/preview the uploaded file

### Public Page (`/grief-camp`)
1. Visitors see the "Download 2027 Camp Flyer" button
2. If flyer exists, button downloads the file
3. If no flyer uploaded yet, button shows "Flyer coming soon"

## Technical Implementation

### Database
- Uses `site_settings` table with key `grief_camp_flyer_url`
- Migration: `20260921200000_add_camp_flyer_setting`

### API Endpoints
- `POST /api/upload/grief-camp-flyer` - Upload new flyer
- `GET /api/upload/grief-camp-flyer` - Get current flyer URL

### Files Created/Modified
1. **Migration**: `prisma/migrations/20260921200000_add_camp_flyer_setting/migration.sql`
2. **API Route**: `src/app/api/upload/grief-camp-flyer/route.ts`
3. **Server Query**: `src/server/queries/settings.ts`
4. **Upload Component**: `src/features/portal/components/flyer-upload.tsx`
5. **Dashboard Page**: `src/app/(portal)/dashboard/programs/page.tsx`
6. **Public Page**: `src/app/(public)/grief-camp/page.tsx`
7. **Grief Camp Component**: `src/features/public/grief-camp/components/grief-camp-page.tsx`

## Deployment to Production (Vercel + PostgreSQL)

### Prerequisites
- Vercel Blob storage must be enabled for your project
- Database connection must be configured
- Admin user must exist in production

### Step 1: Run Database Migration
```bash
# Connect to your Vercel Postgres database
# Option A: Using Vercel CLI
vercel env pull .env.local
npm run db:migrate

# Option B: Directly via connection string
DATABASE_URL="postgresql://..." npm run db:migrate

# Option C: Run migration SQL directly in Vercel Postgres dashboard
# Navigate to: Vercel Dashboard > Storage > Your Database > Query
# Execute the migration SQL from:
# prisma/migrations/20260921200000_add_camp_flyer_setting/migration.sql
```

### Step 2: Deploy Code
```bash
# Push to your deployment branch (e.g., camal)
git add .
git commit -m "feat: add grief camp flyer upload feature"
git push origin camal

# Or deploy directly
vercel --prod
```

### Step 3: Verify Deployment
1. Navigate to your production dashboard: `https://recro-group.vercel.app/dashboard/programs`
2. Upload a test flyer
3. Visit `https://recro-group.vercel.app/grief-camp`
4. Verify download button works

### Step 4: Upload Production Flyer
1. Login as admin
2. Go to `/dashboard/programs`
3. Upload the official Grief Camp 2027 flyer
4. Verify it appears on the public page

## Environment Variables Required
```bash
# Vercel Blob (automatically set by Vercel)
BLOB_READ_WRITE_TOKEN=

# Database (already configured)
DATABASE_URL=
```

## Security
- ✅ Admin authentication required
- ✅ File type validation (images and PDFs only)
- ✅ File size limit (10MB)
- ✅ Public read access for downloads
- ✅ Uploaded files are publicly accessible via Vercel Blob

## Troubleshooting

### Migration Issues
If migration fails in production:
1. Check database connection
2. Manually run the SQL in Vercel Postgres dashboard:
```sql
INSERT INTO "site_settings" ("id", "key", "value", "updatedAt")
VALUES (
  'grief_camp_flyer_url',
  'grief_camp_flyer_url',
  '',
  NOW()
)
ON CONFLICT ("key") DO NOTHING;
```

### Upload Issues
- Ensure Vercel Blob is enabled in project settings
- Check `BLOB_READ_WRITE_TOKEN` environment variable
- Verify admin authentication is working

### Download Button Not Showing
- Check if flyer URL is stored in database
- Verify `getGriefCampFlyerUrl()` is fetching correctly
- Check browser console for errors

## Future Enhancements
- [ ] Add multiple flyer versions (2027, 2028, etc.)
- [ ] Track download analytics
- [ ] Support multiple file formats
- [ ] Add image compression
- [ ] Bulk upload for different camp sessions
