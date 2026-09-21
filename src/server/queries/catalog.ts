import "server-only";

import { prisma } from "@/lib/prisma";
import {
  extractYoutubeId,
  readingTimeLabel,
  youtubeEmbedUrl,
  youtubeThumbnailUrl,
} from "@/lib/content";
import type {
  PublicMediaItem,
  PublicResource,
} from "@/features/public/content/types";
import {
  getPublishedBlogPostBySlug,
  listBlogPosts as listBlogPostRecords,
  listMediaItems as listMediaItemRecords,
  listPublishedBlogPosts,
  listPublishedMediaItems,
  listRelatedBlogPosts,
} from "@/server/queries/content-store";

export type { PublicMediaItem, PublicResource };

export async function listServices() {
  return prisma.service.findMany({
    orderBy: [{ category: "asc" }, { title: "asc" }],
    include: { _count: { select: { bookings: true } } },
  });
}

export async function listTherapists() {
  return prisma.therapist.findMany({
    orderBy: [{ isActive: "desc" }, { fullName: "asc" }],
    include: { _count: { select: { bookings: true } } },
  });
}

export async function listFaqs() {
  return prisma.faq.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
}

export async function listTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
}

export async function listBlogPosts() {
  return listBlogPostRecords();
}

export async function listMediaItems() {
  return listMediaItemRecords();
}

function toPublicResource(post: {
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  category: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  author: string | null;
}): PublicResource {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    category: post.category ?? "Resources",
    readingTime: readingTimeLabel(post.body),
    publishedAt: (post.publishedAt ?? post.createdAt).toISOString(),
    content: post.body,
    author: post.author,
  };
}

function toPublicMediaItem(item: {
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnailUrl: string | null;
  category: string | null;
  duration: string | null;
  therapist: string | null;
}): PublicMediaItem {
  const videoId = extractYoutubeId(item.url);
  return {
    id: item.id,
    title: item.title,
    excerpt: item.description ?? "",
    category: item.category ?? "Media",
    duration: item.duration ?? "",
    videoId,
    embedUrl: videoId ? youtubeEmbedUrl(videoId, true) : item.url,
    thumbnail:
      item.thumbnailUrl ||
      (videoId ? youtubeThumbnailUrl(videoId) : "/assets/media.jpg"),
    therapist: item.therapist ?? "",
  };
}

export async function listPublishedResources(): Promise<PublicResource[]> {
  const posts = await listPublishedBlogPosts();
  return posts.map(toPublicResource);
}

export async function getPublishedResourceBySlug(
  slug: string,
): Promise<PublicResource | null> {
  const post = await getPublishedBlogPostBySlug(slug);
  return post ? toPublicResource(post) : null;
}

export async function listRelatedResources(
  slug: string,
  category: string,
  take = 3,
): Promise<PublicResource[]> {
  const others = await listRelatedBlogPosts(slug, 20);

  const sameCategory = others.filter((post) => post.category === category);
  const selected =
    sameCategory.length > 0
      ? [
          ...sameCategory,
          ...others.filter((post) => post.category !== category),
        ].slice(0, take)
      : others.slice(0, take);

  return selected.map(toPublicResource);
}

export async function listPublishedMedia(): Promise<PublicMediaItem[]> {
  const items = await listPublishedMediaItems();
  return items.map(toPublicMediaItem);
}

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  createdAt: Date;
};

function mapUserRow(user: {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  createdAt: Date;
}): StaffMember {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role ?? "customer",
    banned: user.banned ?? false,
    createdAt: user.createdAt,
  };
}

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  banned: true,
  createdAt: true,
} as const;

export async function listUsers(): Promise<StaffMember[]> {
  const users = await prisma.user.findMany({
    orderBy: [{ createdAt: "desc" }, { name: "asc" }],
    select: userSelect,
  });

  return users.map(mapUserRow);
}

export async function listStaff(): Promise<StaffMember[]> {
  const users = await prisma.user.findMany({
    where: { role: { in: ["admin", "receptionist"] } },
    orderBy: [{ role: "asc" }, { name: "asc" }],
    select: userSelect,
  });

  return users.map(mapUserRow);
}

export type CustomerFilters = {
  search?: string;
  take?: number;
  skip?: number;
};

export async function listCustomers(filters: CustomerFilters = {}) {
  const { search, take = 100, skip = 0 } = filters;

  const where = {
    role: "customer",
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        accountType: true,
        createdAt: true,
        _count: { select: { bookings: true, payments: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total };
}
