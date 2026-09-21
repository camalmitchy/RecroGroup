import {
  ContentPanel,
  type MediaItemRow,
  type ResourceRow,
} from "@/features/portal/components/content-panel";
import { formatDate } from "@/features/portal/lib/format";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { listBlogPosts, listMediaItems, listTherapists } from "@/server/queries/catalog";

export default async function ContentPage() {
  await getRequiredSession("/dashboard/content");

  const [posts, media, therapists] = await Promise.all([
    listBlogPosts(),
    listMediaItems(),
    listTherapists(),
  ]);

  const resourceRows: ResourceRow[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    body: post.body ?? "",
    category: post.category ?? "",
    author: post.author ?? "",
    isPublished: post.isPublished,
    publishedLabel: formatDate(post.publishedAt ?? post.createdAt),
  }));

  const mediaRows: MediaItemRow[] = media.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description ?? "",
    url: item.url,
    category: item.category ?? "",
    duration: item.duration ?? "",
    therapist: item.therapist ?? "",
    isPublished: item.isPublished,
    createdLabel: formatDate(item.createdAt),
  }));

  return (
    <ContentPanel
      resources={resourceRows}
      mediaItems={mediaRows}
      therapists={therapists
        .filter((therapist) => therapist.isActive)
        .map((therapist) => therapist.fullName)}
    />
  );
}
