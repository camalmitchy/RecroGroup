import "server-only";

import { del, get, put } from "@vercel/blob";

export function vercelBlobConfigured() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN?.trim() || process.env.VERCEL,
  );
}

function blobErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/token|oidc|unauthorized|not found|store/i.test(message)) {
    return "Vercel Blob is not connected. In the Vercel project open Storage, create a Blob store, link it to recro-group, then redeploy.";
  }
  return message || "Could not store the file";
}

function privateStoreError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /private|access/i.test(message);
}

export async function putPublicBlob(input: {
  pathname: string;
  body: Buffer;
  contentType: string;
  addRandomSuffix?: boolean;
  allowOverwrite?: boolean;
}) {
  const options = {
    contentType: input.contentType,
    addRandomSuffix: input.addRandomSuffix ?? false,
    allowOverwrite: input.allowOverwrite ?? false,
  };

  try {
    return await put(input.pathname, input.body, {
      ...options,
      access: "public",
    });
  } catch (error) {
    if (!privateStoreError(error)) {
      throw new Error(blobErrorMessage(error));
    }
  }

  try {
    return await put(input.pathname, input.body, {
      ...options,
      access: "private",
    });
  } catch (error) {
    throw new Error(blobErrorMessage(error));
  }
}

export async function readBlob(url: string) {
  try {
    return await get(url, { access: "public" });
  } catch {
    return await get(url, { access: "private" });
  }
}

export async function deletePublicBlob(url: string) {
  try {
    await del(url);
  } catch (error) {
    console.error("[blob] could not delete", error);
  }
}
