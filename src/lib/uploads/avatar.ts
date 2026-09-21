import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { put } from "@vercel/blob";

export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

const ALLOWED = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

const MAGIC: Array<{ ext: string; bytes: number[]; offset?: number }> = [
  { ext: "jpg", bytes: [0xff, 0xd8, 0xff] },
  { ext: "png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { ext: "webp", bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 },
];

export type AvatarUploadResult =
  | { ok: true; url: string; contentType: string; bytes: number }
  | { ok: false; error: string };

function sniff(buffer: Uint8Array): string | null {
  for (const sig of MAGIC) {
    const offset = sig.offset ?? 0;
    if (buffer.length < offset + sig.bytes.length) continue;
    if (sig.bytes.every((b, i) => buffer[offset + i] === b)) return sig.ext;
  }
  return null;
}

export function describeAllowedAvatarTypes() {
  return "JPG, PNG or WEBP up to 2MB";
}

export async function uploadAvatar(
  file: File,
  userId: string,
): Promise<AvatarUploadResult> {
  if (file.size === 0) return { ok: false, error: "The file is empty" };
  if (file.size > MAX_AVATAR_BYTES) {
    return { ok: false, error: `Photo is too large — ${describeAllowedAvatarTypes()}` };
  }

  const declared = ALLOWED.get(file.type);
  if (!declared) {
    return { ok: false, error: `Unsupported photo type — ${describeAllowedAvatarTypes()}` };
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  const actual = sniff(buffer);

  if (!actual || actual !== declared) {
    return { ok: false, error: "That file does not look like a valid photo" };
  }

  const filename = `${userId}-${Date.now()}.${actual}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`avatars/${filename}`, Buffer.from(buffer), {
      access: "public",
      contentType: file.type,
      addRandomSuffix: true,
    });

    return { ok: true, url: blob.url, contentType: file.type, bytes: file.size };
  }

  if (process.env.NODE_ENV === "development") {
    const dir = path.join(process.cwd(), "public", "uploads", "avatars");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), Buffer.from(buffer));
    return {
      ok: true,
      url: `/uploads/avatars/${filename}`,
      contentType: file.type,
      bytes: file.size,
    };
  }

  return {
    ok: false,
    error: "Photo uploads are not configured on this environment",
  };
}
