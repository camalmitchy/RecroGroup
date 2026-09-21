const YOUTUBE_ID = /^[\w-]{11}$/;

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function readingTimeLabel(body: string | null | undefined) {
  const words = (body ?? "").trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return "1 min read";
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function extractYoutubeId(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (YOUTUBE_ID.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0] ?? "";
      return YOUTUBE_ID.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const fromQuery = url.searchParams.get("v");
      if (fromQuery && YOUTUBE_ID.test(fromQuery)) return fromQuery;

      const parts = url.pathname.split("/").filter(Boolean);
      for (const marker of ["embed", "shorts", "live"]) {
        const index = parts.indexOf(marker);
        const id = index >= 0 ? (parts[index + 1] ?? "") : "";
        if (YOUTUBE_ID.test(id)) return id;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function youtubeWatchUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}

export function youtubeThumbnailUrl(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function youtubeEmbedUrl(id: string, autoplay = false) {
  const params = autoplay ? "?autoplay=1&rel=0" : "?rel=0";
  return `https://www.youtube.com/embed/${id}${params}`;
}
