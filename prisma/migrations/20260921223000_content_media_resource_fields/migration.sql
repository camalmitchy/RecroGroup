-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "category" TEXT;

-- AlterTable
ALTER TABLE "media_items" ADD COLUMN IF NOT EXISTS "category" TEXT;
ALTER TABLE "media_items" ADD COLUMN IF NOT EXISTS "duration" TEXT;
ALTER TABLE "media_items" ADD COLUMN IF NOT EXISTS "therapist" TEXT;
