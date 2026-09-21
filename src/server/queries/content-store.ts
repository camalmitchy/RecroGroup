import "server-only";

import { randomUUID } from "node:crypto";

import { prisma } from "@/lib/prisma";

export type BlogPostRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  coverUrl: string | null;
  author: string | null;
  category: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type MediaItemRecord = {
  id: string;
  title: string;
  description: string | null;
  mediaType: "VIDEO" | "ARTICLE" | "PODCAST";
  url: string;
  thumbnailUrl: string | null;
  category: string | null;
  duration: string | null;
  therapist: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type BlogPostWrite = {
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  coverUrl: string | null;
  author: string | null;
  category: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
};

export type MediaItemWrite = {
  title: string;
  description: string | null;
  mediaType: "VIDEO" | "ARTICLE" | "PODCAST";
  url: string;
  thumbnailUrl: string | null;
  category: string | null;
  duration: string | null;
  therapist: string | null;
  isPublished: boolean;
};

let columnsReady = false;

export async function ensureContentColumns() {
  if (columnsReady) return;

  await prisma.$executeRawUnsafe(
    `ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "category" TEXT`,
  );
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "media_items" ADD COLUMN IF NOT EXISTS "category" TEXT`,
  );
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "media_items" ADD COLUMN IF NOT EXISTS "duration" TEXT`,
  );
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "media_items" ADD COLUMN IF NOT EXISTS "therapist" TEXT`,
  );

  columnsReady = true;
}

function asDate(value: unknown): Date | null {
  if (value == null || value === "") return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function asBool(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    return value === "true" || value === "t" || value === "1";
  }
  return false;
}

function asString(value: unknown): string {
  return value == null ? "" : String(value);
}

function asNullableString(value: unknown): string | null {
  if (value == null) return null;
  const text = String(value);
  return text.length > 0 ? text : null;
}

function mapBlogPost(row: Record<string, unknown>): BlogPostRecord {
  return {
    id: asString(row.id),
    title: asString(row.title),
    slug: asString(row.slug),
    excerpt: asNullableString(row.excerpt),
    body: asNullableString(row.body),
    coverUrl: asNullableString(row.coverUrl),
    author: asNullableString(row.author),
    category: asNullableString(row.category),
    isPublished: asBool(row.isPublished),
    publishedAt: asDate(row.publishedAt),
    createdAt: asDate(row.createdAt) ?? new Date(0),
    updatedAt: asDate(row.updatedAt) ?? new Date(0),
  };
}

function mapMediaItem(row: Record<string, unknown>): MediaItemRecord {
  const mediaType = asString(row.mediaType);
  return {
    id: asString(row.id),
    title: asString(row.title),
    description: asNullableString(row.description),
    mediaType:
      mediaType === "ARTICLE" || mediaType === "PODCAST" ? mediaType : "VIDEO",
    url: asString(row.url),
    thumbnailUrl: asNullableString(row.thumbnailUrl),
    category: asNullableString(row.category),
    duration: asNullableString(row.duration),
    therapist: asNullableString(row.therapist),
    isPublished: asBool(row.isPublished),
    createdAt: asDate(row.createdAt) ?? new Date(0),
    updatedAt: asDate(row.updatedAt) ?? new Date(0),
  };
}

export async function listBlogPosts(): Promise<BlogPostRecord[]> {
  await ensureContentColumns();
  const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
    SELECT id, title, slug, excerpt, body, "coverUrl", author, category,
           "isPublished", "publishedAt", "createdAt", "updatedAt"
    FROM "blog_posts"
    ORDER BY "publishedAt" DESC NULLS LAST, "createdAt" DESC
  `;
  return rows.map(mapBlogPost);
}

export async function listPublishedBlogPosts(): Promise<BlogPostRecord[]> {
  await ensureContentColumns();
  const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
    SELECT id, title, slug, excerpt, body, "coverUrl", author, category,
           "isPublished", "publishedAt", "createdAt", "updatedAt"
    FROM "blog_posts"
    WHERE "isPublished" = true
    ORDER BY "publishedAt" DESC NULLS LAST, "createdAt" DESC
  `;
  return rows.map(mapBlogPost);
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPostRecord | null> {
  await ensureContentColumns();
  const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
    SELECT id, title, slug, excerpt, body, "coverUrl", author, category,
           "isPublished", "publishedAt", "createdAt", "updatedAt"
    FROM "blog_posts"
    WHERE slug = ${slug}
    LIMIT 1
  `;
  return rows[0] ? mapBlogPost(rows[0]) : null;
}

export async function getPublishedBlogPostBySlug(
  slug: string,
): Promise<BlogPostRecord | null> {
  await ensureContentColumns();
  const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
    SELECT id, title, slug, excerpt, body, "coverUrl", author, category,
           "isPublished", "publishedAt", "createdAt", "updatedAt"
    FROM "blog_posts"
    WHERE slug = ${slug} AND "isPublished" = true
    LIMIT 1
  `;
  return rows[0] ? mapBlogPost(rows[0]) : null;
}

export async function getBlogPostById(
  id: string,
): Promise<BlogPostRecord | null> {
  await ensureContentColumns();
  const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
    SELECT id, title, slug, excerpt, body, "coverUrl", author, category,
           "isPublished", "publishedAt", "createdAt", "updatedAt"
    FROM "blog_posts"
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapBlogPost(rows[0]) : null;
}

export async function listRelatedBlogPosts(
  slug: string,
  take = 20,
): Promise<BlogPostRecord[]> {
  await ensureContentColumns();
  const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
    SELECT id, title, slug, excerpt, body, "coverUrl", author, category,
           "isPublished", "publishedAt", "createdAt", "updatedAt"
    FROM "blog_posts"
    WHERE "isPublished" = true AND slug <> ${slug}
    ORDER BY "publishedAt" DESC NULLS LAST, "createdAt" DESC
    LIMIT ${take}
  `;
  return rows.map(mapBlogPost);
}

export async function insertBlogPost(
  data: BlogPostWrite,
): Promise<BlogPostRecord> {
  await ensureContentColumns();
  const id = randomUUID();
  const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
    INSERT INTO "blog_posts" (
      "id", "title", "slug", "excerpt", "body", "coverUrl", "author", "category",
      "isPublished", "publishedAt", "createdAt", "updatedAt"
    ) VALUES (
      ${id},
      ${data.title},
      ${data.slug},
      ${data.excerpt},
      ${data.body},
      ${data.coverUrl},
      ${data.author},
      ${data.category},
      ${data.isPublished},
      ${data.publishedAt},
      NOW(),
      NOW()
    )
    RETURNING id, title, slug, excerpt, body, "coverUrl", author, category,
              "isPublished", "publishedAt", "createdAt", "updatedAt"
  `;
  const created = rows[0] ? mapBlogPost(rows[0]) : null;
  if (!created) {
    throw new Error("Failed to create resource");
  }
  return created;
}

export async function updateBlogPost(
  id: string,
  data: BlogPostWrite,
): Promise<BlogPostRecord> {
  await ensureContentColumns();
  const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
    UPDATE "blog_posts"
    SET
      "title" = ${data.title},
      "slug" = ${data.slug},
      "excerpt" = ${data.excerpt},
      "body" = ${data.body},
      "coverUrl" = ${data.coverUrl},
      "author" = ${data.author},
      "category" = ${data.category},
      "isPublished" = ${data.isPublished},
      "publishedAt" = ${data.publishedAt},
      "updatedAt" = NOW()
    WHERE id = ${id}
    RETURNING id, title, slug, excerpt, body, "coverUrl", author, category,
              "isPublished", "publishedAt", "createdAt", "updatedAt"
  `;
  const updated = rows[0] ? mapBlogPost(rows[0]) : null;
  if (!updated) {
    throw new Error("Resource not found");
  }
  return updated;
}

export async function deleteBlogPost(
  id: string,
): Promise<{ id: string; slug: string }> {
  await ensureContentColumns();
  const rows = await prisma.$queryRaw<Array<{ id: string; slug: string }>>`
    DELETE FROM "blog_posts"
    WHERE id = ${id}
    RETURNING id, slug
  `;
  const deleted = rows[0];
  if (!deleted) {
    throw new Error("Resource not found");
  }
  return deleted;
}

export async function listMediaItems(): Promise<MediaItemRecord[]> {
  await ensureContentColumns();
  const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
    SELECT id, title, description, "mediaType", url, "thumbnailUrl", category,
           duration, therapist, "isPublished", "createdAt", "updatedAt"
    FROM "media_items"
    ORDER BY "createdAt" DESC
  `;
  return rows.map(mapMediaItem);
}

export async function listPublishedMediaItems(): Promise<MediaItemRecord[]> {
  await ensureContentColumns();
  const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
    SELECT id, title, description, "mediaType", url, "thumbnailUrl", category,
           duration, therapist, "isPublished", "createdAt", "updatedAt"
    FROM "media_items"
    WHERE "isPublished" = true
    ORDER BY "createdAt" DESC
  `;
  return rows.map(mapMediaItem);
}

export async function insertMediaItem(
  data: MediaItemWrite,
): Promise<MediaItemRecord> {
  await ensureContentColumns();
  const id = randomUUID();
  const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
    INSERT INTO "media_items" (
      "id", "title", "description", "mediaType", "url", "thumbnailUrl",
      "category", "duration", "therapist", "isPublished", "createdAt", "updatedAt"
    ) VALUES (
      ${id},
      ${data.title},
      ${data.description},
      CAST(${data.mediaType} AS "MediaType"),
      ${data.url},
      ${data.thumbnailUrl},
      ${data.category},
      ${data.duration},
      ${data.therapist},
      ${data.isPublished},
      NOW(),
      NOW()
    )
    RETURNING id, title, description, "mediaType", url, "thumbnailUrl", category,
              duration, therapist, "isPublished", "createdAt", "updatedAt"
  `;
  const created = rows[0] ? mapMediaItem(rows[0]) : null;
  if (!created) {
    throw new Error("Failed to create media item");
  }
  return created;
}

export async function updateMediaItem(
  id: string,
  data: MediaItemWrite,
): Promise<MediaItemRecord> {
  await ensureContentColumns();
  const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
    UPDATE "media_items"
    SET
      "title" = ${data.title},
      "description" = ${data.description},
      "mediaType" = CAST(${data.mediaType} AS "MediaType"),
      "url" = ${data.url},
      "thumbnailUrl" = ${data.thumbnailUrl},
      "category" = ${data.category},
      "duration" = ${data.duration},
      "therapist" = ${data.therapist},
      "isPublished" = ${data.isPublished},
      "updatedAt" = NOW()
    WHERE id = ${id}
    RETURNING id, title, description, "mediaType", url, "thumbnailUrl", category,
              duration, therapist, "isPublished", "createdAt", "updatedAt"
  `;
  const updated = rows[0] ? mapMediaItem(rows[0]) : null;
  if (!updated) {
    throw new Error("Media item not found");
  }
  return updated;
}

export async function deleteMediaItemRecord(
  id: string,
): Promise<{ id: string }> {
  await ensureContentColumns();
  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    DELETE FROM "media_items"
    WHERE id = ${id}
    RETURNING id
  `;
  const deleted = rows[0];
  if (!deleted) {
    throw new Error("Media item not found");
  }
  return deleted;
}
