export type PublicResource = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  publishedAt: string;
  content: string | null;
  author: string | null;
};

export type PublicMediaItem = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  duration: string;
  videoId: string | null;
  embedUrl: string;
  thumbnail: string;
  therapist: string;
};
