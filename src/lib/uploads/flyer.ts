import "server-only";

import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { del, put } from "@vercel/blob";

import {
  FLYER_CONTENT_TYPE,
  MAX_FLYER_BYTES,
  describeAllowedFlyerTypes,
  resolveFlyerExtension,
} from "./flyer-types";

export const FLYER_SETTING_KEY = "grief_camp_flyer_url";
export const LOCAL_FLYER_DIR = path.join("uploads", "grief-camp");
export const LOCAL_FLYER_PATHNAME = `${LOCAL_FLYER_DIR}/flyer`;

export type FlyerUploadResult =
  | { ok: true; url: string; contentType: string; bytes: number }
  | { ok: false; error: string };

function blobPath(ext: string) {
  return `grief-camp/flyer.${ext}`;
}

function localUrl(ext: string) {
  return `/${LOCAL_FLYER_PATHNAME}.${ext}`;
}

function localFile(ext: string) {
  return path.join(process.cwd(), "public", `${LOCAL_FLYER_PATHNAME}.${ext}`);
}

export async function removeStoredFlyer(url: string | null | undefined) {
  if (!url) return;

  if (url.includes("blob.vercel-storage.com") || url.includes(".public.blob.")) {
    try {
      await del(url);
    } catch (error) {
      console.error("[flyer] could not delete blob", error);
    }
    return;
  }

  if (url.startsWith(`/${LOCAL_FLYER_DIR}/`)) {
    try {
      await unlink(path.join(process.cwd(), "public", url.replace(/^\//, "")));
    } catch {
      // Already gone.
    }
  }
}

export async function uploadGriefCampFlyer(
  file: File,
  previousUrl?: string | null,
): Promise<FlyerUploadResult> {
  if (file.size === 0) return { ok: false, error: "The file is empty" };
  if (file.size > MAX_FLYER_BYTES) {
    return { ok: false, error: `File is too large — ${describeAllowedFlyerTypes()}` };
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  const ext = resolveFlyerExtension(file, buffer);
  if (!ext) {
    return { ok: false, error: `Unsupported file type — ${describeAllowedFlyerTypes()}` };
  }

  const contentType = FLYER_CONTENT_TYPE[ext];
  await removeStoredFlyer(previousUrl);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(blobPath(ext), Buffer.from(buffer), {
      access: "public",
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return { ok: true, url: blob.url, contentType, bytes: file.size };
  }

  if (process.env.NODE_ENV === "development") {
    const dir = path.join(process.cwd(), "public", LOCAL_FLYER_DIR);
    await mkdir(dir, { recursive: true });
    await writeFile(localFile(ext), Buffer.from(buffer));
    return { ok: true, url: localUrl(ext), contentType, bytes: file.size };
  }

  return {
    ok: false,
    error:
      "File uploads are not configured on this environment. Add BLOB_READ_WRITE_TOKEN in Vercel.",
  };
}
