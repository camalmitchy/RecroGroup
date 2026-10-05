export const MAX_FLYER_BYTES = 10 * 1024 * 1024;

export const MIME_TO_EXT = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/pjpeg", "jpg"],
  ["image/png", "png"],
  ["image/gif", "gif"],
  ["image/webp", "webp"],
  ["image/heic", "heic"],
  ["image/heif", "heic"],
  ["application/pdf", "pdf"],
]);

export const FLYER_CONTENT_TYPE: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  heic: "image/heic",
  pdf: "application/pdf",
};

const MAGIC: Array<{ ext: string; bytes: number[]; offset?: number }> = [
  { ext: "jpg", bytes: [0xff, 0xd8, 0xff] },
  { ext: "png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { ext: "gif", bytes: [0x47, 0x49, 0x46, 0x38] },
  { ext: "pdf", bytes: [0x25, 0x50, 0x44, 0x46] },
  { ext: "webp", bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 },
  { ext: "heic", bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 },
];

export function describeAllowedFlyerTypes() {
  return "JPG, JPEG, PNG, GIF, WEBP, HEIC or PDF up to 10MB";
}

export function sniffFlyer(buffer: Uint8Array): string | null {
  for (const sig of MAGIC) {
    const offset = sig.offset ?? 0;
    if (buffer.length < offset + sig.bytes.length) continue;
    if (sig.bytes.every((byte, i) => buffer[offset + i] === byte)) return sig.ext;
  }
  return null;
}

export function extensionFromName(name: string): string | null {
  const ext = name.split(".").pop()?.trim().toLowerCase();
  if (!ext) return null;
  if (ext === "jpeg" || ext === "jpe" || ext === "jfif") return "jpg";
  if (ext === "heif") return "heic";
  return FLYER_CONTENT_TYPE[ext] ? ext : null;
}

export function resolveFlyerExtension(file: {
  name: string;
  type: string;
}, buffer: Uint8Array): string | null {
  const sniffed = sniffFlyer(buffer);
  if (sniffed) return sniffed;
  const fromMime = MIME_TO_EXT.get(file.type.toLowerCase());
  if (fromMime) return fromMime;
  return extensionFromName(file.name);
}

export function flyerAcceptAttribute() {
  return ".jpg,.jpeg,.jpe,.jfif,.png,.gif,.webp,.heic,.heif,.pdf,image/jpeg,image/png,image/gif,image/webp,image/heic,application/pdf";
}

export function isFlyerImageUrl(url: string | null | undefined) {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return [".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic"].some((ext) =>
    clean.endsWith(ext),
  );
}

export function isFlyerPdfUrl(url: string | null | undefined) {
  if (!url) return false;
  return url.split("?")[0].toLowerCase().endsWith(".pdf");
}

/** Customer-facing URL. Blob files are served by our app so a private store still works. */
export function customerFlyerUrl(storedUrl: string, download = false) {
  if (storedUrl.startsWith("/")) return storedUrl;
  return download ? "/api/grief-camp-flyer?download=1" : "/api/grief-camp-flyer";
}
