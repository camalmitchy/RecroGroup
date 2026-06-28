export type PopularVideo = {
  id: string;
  title: string;
  duration: string;
  videoId: string;
  thumbnail: string;
  therapist?: string;
};

export type ArticleContent = {
  id: string;
  slug: string;
  type: "article";
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  image: string;
  featured?: boolean;
};

export type VideoContent = {
  id: string;
  type: "video";
  category: string;
  title: string;
  excerpt: string;
  duration: string;
  videoId: string;
  thumbnail: string;
  therapist: string;
};

export type InsightContent = ArticleContent | VideoContent;

export const TEASER_COUNT = 4;

export const categories = [
  "All",
  "Articles",
  "Videos",
  "Relationships",
  "Grief & Loss",
  "Parenting",
  "Workplace",
  "Therapy 101",
] as const;

export type InsightCategory = (typeof categories)[number];

export const allContent: InsightContent[] = [
  {
    id: "featured-1",
    slug: "from-the-foxhole-to-the-front-porch",
    type: "article",
    category: "Family",
    title: "From the foxhole to the front porch — a family perspective",
    excerpt:
      "With great joy and sadness Kenya welcomed home its troops. The readjustment from the family unit takes years. A look at reintegration and redeployment through the lens of family systems.",
    readTime: "8 min",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800",
  },
  {
    id: "art-1",
    slug: "the-perfect-storm",
    type: "article",
    category: "Relationships",
    title: "The perfect storm",
    excerpt:
      "As years go by, relationships tend to move and take all kinds of turns and twists.",
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800",
  },
  {
    id: "art-2",
    slug: "when-grief-shows-up-at-the-office",
    type: "article",
    category: "Grief & Loss",
    title: "When grief shows up at the office",
    excerpt:
      "What to say (and not say) when a colleague returns to work after a loss.",
    readTime: "5 min",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
  },
  {
    id: "art-3",
    slug: "repair-conversations-for-couples",
    type: "article",
    category: "Relationships",
    title: "Repair conversations for couples",
    excerpt:
      "A simple structure that turns most arguments into a chance to grow closer.",
    readTime: "7 min",
    image:
      "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=800",
  },
  {
    id: "art-4",
    slug: "how-children-grieve-differently",
    type: "article",
    category: "Parenting",
    title: "How children grieve differently",
    excerpt:
      "Why a child laughing the day after a loss doesn't mean they're 'fine'.",
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800",
  },
  {
    id: "art-5",
    slug: "five-gentle-ways-to-start-therapy",
    type: "article",
    category: "Therapy 101",
    title: "Five gentle ways to start therapy",
    excerpt:
      "Tiny first steps for people who've been thinking about it for a while.",
    readTime: "4 min",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800",
  },
  {
    id: "art-7",
    slug: "anxiety-told-simply",
    type: "article",
    category: "Workplace",
    title: "Anxiety, told simply",
    excerpt:
      "What anxiety is actually doing in the body, and how therapy quiets it.",
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800",
  },
  {
    id: "vid-1",
    type: "video",
    category: "Therapy 101",
    title: "Benefits of therapy",
    excerpt:
      "Why starting therapy is one of the most generous things you can do for yourself.",
    duration: "5:12",
    videoId: "yrtRlE6HlUU",
    thumbnail: "https://i.ytimg.com/vi/yrtRlE6HlUU/hqdefault.jpg",
    therapist: "Dr. Michelle Karume",
  },
  {
    id: "vid-2",
    type: "video",
    category: "Relationships",
    title: "Expectations in relationships",
    excerpt:
      "How unmet, uncommunicated expectations quietly breed disappointment.",
    duration: "4 min",
    videoId: "6yd3gLyuR_0",
    thumbnail: "https://i.ytimg.com/vi/6yd3gLyuR_0/hqdefault.jpg",
    therapist: "Dr. Michelle Karume",
  },
  {
    id: "vid-3",
    type: "video",
    category: "Parenting",
    title: "Parenting apart",
    excerpt:
      "Co-parenting through and after separation, with the child at the centre.",
    duration: "7 min",
    videoId: "JnfjyI05zSw",
    thumbnail: "https://i.ytimg.com/vi/JnfjyI05zSw/hqdefault.jpg",
    therapist: "Dr. Michelle Karume",
  },
  {
    id: "vid-4",
    type: "video",
    category: "Grief & Loss",
    title: "Invisible mourners",
    excerpt: "Children grieve too. Here's how to see, name and support it.",
    duration: "5:08",
    videoId: "vsTbJassTKA",
    thumbnail: "https://i.ytimg.com/vi/vsTbJassTKA/hqdefault.jpg",
    therapist: "Dr. Michelle Karume",
  },
  {
    id: "vid-5",
    type: "video",
    category: "Relationships",
    title: "Forgiveness",
    excerpt:
      "What forgiveness is — and what it isn't — in healing relationships.",
    duration: "6:15",
    videoId: "f3omumMGIw0",
    thumbnail: "https://i.ytimg.com/vi/f3omumMGIw0/hqdefault.jpg",
    therapist: "Dr. Michelle Karume",
  },
];

export const popularVideos: PopularVideo[] = [
  {
    id: "pop-1",
    title: "Benefits of therapy",
    duration: "5:12",
    videoId: "yrtRlE6HlUU",
    thumbnail: "https://i.ytimg.com/vi/yrtRlE6HlUU/hqdefault.jpg",
    therapist: "Dr. Michelle Karume",
  },
  {
    id: "pop-2",
    title: "Parenting apart",
    duration: "7:15",
    videoId: "JnfjyI05zSw",
    thumbnail: "https://i.ytimg.com/vi/JnfjyI05zSw/hqdefault.jpg",
    therapist: "Dr. Michelle Karume",
  },
  {
    id: "pop-3",
    title: "Invisible mourners",
    duration: "5:08",
    videoId: "vsTbJassTKA",
    thumbnail: "https://i.ytimg.com/vi/vsTbJassTKA/hqdefault.jpg",
    therapist: "Dr. Michelle Karume",
  },
  {
    id: "pop-4",
    title: "Expectations in relationships",
    duration: "4 min",
    videoId: "6yd3gLyuR_0",
    thumbnail: "https://i.ytimg.com/vi/6yd3gLyuR_0/hqdefault.jpg",
    therapist: "Dr. Michelle Karume",
  },
  {
    id: "pop-5",
    title: "Forgiveness",
    duration: "6:15",
    videoId: "f3omumMGIw0",
    thumbnail: "https://i.ytimg.com/vi/f3omumMGIw0/hqdefault.jpg",
    therapist: "Dr. Michelle Karume",
  },
];

export function getFeaturedContent() {
  return allContent.find(
    (item): item is ArticleContent => item.type === "article" && !!item.featured,
  );
}

export function filterInsights(
  content: InsightContent[],
  category: InsightCategory,
) {
  return content
    .filter((item) => !("featured" in item && item.featured))
    .filter((item) => {
      if (category === "All") return true;
      if (category === "Articles") return item.type === "article";
      if (category === "Videos") return item.type === "video";
      return item.category === category;
    });
}

export function getAllArticles(): ArticleContent[] {
  return allContent.filter((item): item is ArticleContent => item.type === "article");
}

export function getArticleMetaBySlug(slug: string): ArticleContent | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export const articleMetaSlugs = getAllArticles().map((a) => a.slug);
