import {
    AdminContentPage,
    type AdminBlogPostRow,
    type AdminFaqRow,
    type AdminMediaRow,
    type AdminTestimonialRow,
} from "@/features/admin/components/admin-content-page";
import { requireAdminArea } from "@/features/admin/lib/admin-guard";
import { formatDate } from "@/features/portal/lib/format";
import {
    listBlogPosts,
    listFaqs,
    listMediaItems,
    listTestimonials,
} from "@/server/queries/catalog";

export default async function ContentPage() {
    const session = await requireAdminArea();

    const [faqs, testimonials, blogPosts, mediaItems] = await Promise.all([
        listFaqs(),
        listTestimonials(),
        listBlogPosts(),
        listMediaItems(),
    ]);

    const faqRows: AdminFaqRow[] = faqs.map((faq) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        sortOrder: faq.sortOrder,
        isPublished: faq.isPublished,
    }));

    const testimonialRows: AdminTestimonialRow[] = testimonials.map((testimonial) => ({
        id: testimonial.id,
        authorName: testimonial.authorName,
        authorRole: testimonial.authorRole,
        quote: testimonial.quote,
        rating: testimonial.rating,
        isPublished: testimonial.isPublished,
    }));

    const blogRows: AdminBlogPostRow[] = blogPosts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        author: post.author,
        isPublished: post.isPublished,
        publishedAtLabel: post.publishedAt ? formatDate(post.publishedAt) : null,
        createdAtLabel: formatDate(post.createdAt),
    }));

    const mediaRows: AdminMediaRow[] = mediaItems.map((item) => ({
        id: item.id,
        title: item.title,
        mediaType: item.mediaType,
        url: item.url,
        isPublished: item.isPublished,
        createdAtLabel: formatDate(item.createdAt),
    }));

    return (
        <AdminContentPage
            faqs={faqRows}
            testimonials={testimonialRows}
            blogPosts={blogRows}
            mediaItems={mediaRows}
            isAdmin={session.role === "admin"}
        />
    );
}
