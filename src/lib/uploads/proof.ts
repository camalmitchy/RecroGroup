import "server-only";

import { put } from "@vercel/blob";

export const MAX_PROOF_BYTES = 8 * 1024 * 1024;

const ALLOWED = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/heic", "heic"],
  ["image/webp", "webp"],
  ["application/pdf", "pdf"],
]);

const MAGIC: Array<{ ext: string; bytes: number[]; offset?: number }> = [
  { ext: "jpg", bytes: [0xff, 0xd8, 0xff] },
  { ext: "png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { ext: "pdf", bytes: [0x25, 0x50, 0x44, 0x46] },
  { ext: "webp", bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 },
  { ext: "heic", bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 },
];

export type ProofUploadResult =
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

export function describeAllowedProofTypes() {
  return "JPG, PNG, HEIC, WEBP or PDF up to 8MB";
}

export async function uploadProof(
  file: File,
  reference: string,
): Promise<ProofUploadResult> {
  if (file.size === 0) return { ok: false, error: "The file is empty" };
  if (file.size > MAX_PROOF_BYTES) {
    return { ok: false, error: `File is too large — ${describeAllowedProofTypes()}` };
  }

  const declared = ALLOWED.get(file.type);
  if (!declared) {
    return { ok: false, error: `Unsupported file type — ${describeAllowedProofTypes()}` };
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  const actual = sniff(buffer);

  if (!actual || actual !== declared) {
    return {
      ok: false,
      error: "That file does not look like a valid image or PDF",
    };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, error: "File uploads are not configured on this environment" };
  }

  const blob = await put(`payment-proofs/${reference}.${actual}`, Buffer.from(buffer), {
    access: "public",
    contentType: file.type,
    addRandomSuffix: true,
  });

  return { ok: true, url: blob.url, contentType: file.type, bytes: file.size };
}
