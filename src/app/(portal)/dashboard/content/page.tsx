import {
  ContentPanel,
  type BlogPostRow,
  type FaqRow,
  type MediaItemRow,
  type TestimonialRow,
} from "@/features/portal/components/content-panel";
import { formatDate } from "@/features/portal/lib/format";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import {
  listBlogPosts,
  listFaqs,
  listMediaItems,
  listTestimonials,
} from "@/server/queries/catalog";

export default async function ContentPage() {
  await getRequiredSession("/dashboard/content");

  const [posts, media, faqs, testimonials] = await Promise.all([
    listBlogPosts(),
    listMediaItems(),
    listFaqs(),
    listTestimonials(),
  ]);

  const blogRows: BlogPostRow[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    author: post.author,
    isPublished: post.isPublished,
    publishedLabel: formatDate(post.publishedAt),
    createdLabel: formatDate(post.createdAt),
  }));

  const mediaRows: MediaItemRow[] = media.map((item) => ({
    id: item.id,
    title: item.title,
    mediaType: item.mediaType,
    url: item.url,
    isPublished: item.isPublished,
    createdLabel: formatDate(item.createdAt),
  }));

  const faqRows: FaqRow[] = faqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    sortOrder: faq.sortOrder,
    isPublished: faq.isPublished,
  }));

  const testimonialRows: TestimonialRow[] = testimonials.map((testimonial) => ({
    id: testimonial.id,
    authorName: testimonial.authorName,
    authorRole: testimonial.authorRole,
    quote: testimonial.quote,
    rating: testimonial.rating,
    isPublished: testimonial.isPublished,
  }));

  return (
    <ContentPanel
      blogPosts={blogRows}
      mediaItems={mediaRows}
      faqs={faqRows}
      testimonials={testimonialRows}
    />
  );
}
