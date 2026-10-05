"use client";

import { useState } from "react";
import { Download, FileText, Image as ImageIcon, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import {
  describeAllowedFlyerTypes,
  flyerAcceptAttribute,
  customerFlyerUrl,
  isFlyerPdfUrl,
} from "@/lib/uploads/flyer-types";

interface FlyerUploadProps {
  currentUrl: string | null;
  canManage?: boolean;
}

export function FlyerUpload({ currentUrl, canManage = false }: FlyerUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [flyerUrl, setFlyerUrl] = useState(currentUrl);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (flyerUrl) {
      toast.error("Remove the current flyer before uploading a new one.");
      event.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/grief-camp-flyer", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json().catch(() => null)) as
        | { error?: string; url?: string }
        | null;

      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || "Upload failed");
      }

      setFlyerUrl(payload.url);
      toast.success("Flyer is live on the grief camp page.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload file");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleDelete = async () => {
    if (!confirm("Remove the current flyer? Customers will not see a download until you upload another.")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch("/api/upload/grief-camp-flyer", {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.error || "Delete failed");
      }
      setFlyerUrl(null);
      toast.success("Flyer removed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove flyer");
    } finally {
      setDeleting(false);
    }
  };

  const pdf = isFlyerPdfUrl(flyerUrl);

  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
      <div className="mb-6">
        <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
          Grief camp flyer
        </h3>
        <p className="text-sm text-muted-foreground">
          Only one flyer is kept at a time. Remove the current file, then upload the next.
          Customers can view and download it on the public grief camp page.
        </p>
      </div>

      {flyerUrl ? (
        <div className="mb-6 rounded-2xl border border-border bg-muted/30 p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {pdf ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <FileText size={24} />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <ImageIcon size={24} />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-foreground">Current flyer</p>
                <p className="text-xs text-muted-foreground">
                  {pdf ? "PDF document" : "Image file"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={customerFlyerUrl(flyerUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-deep px-4 py-2 text-sm font-semibold text-white hover:bg-primary-deep/90"
              >
                <Download size={16} />
                View
              </a>
              {canManage ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {deleting ? "Removing..." : "Remove"}
                </button>
              ) : null}
            </div>
          </div>

          {!pdf ? (
            <div className="overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={customerFlyerUrl(flyerUrl)}
                alt="Grief camp flyer"
                className="h-auto max-h-96 w-full bg-white object-contain"
              />
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mb-6 text-sm text-muted-foreground">No flyer is published right now.</p>
      )}

      {canManage && !flyerUrl ? (
        <label
          htmlFor="flyer-upload"
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition-colors ${
            uploading
              ? "border-muted bg-muted/20"
              : "cursor-pointer border-border bg-muted/10 hover:bg-muted/20"
          }`}
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary-deep">
            <Upload size={28} />
          </div>
          <p className="mb-1 text-sm font-semibold text-foreground">
            {uploading ? "Uploading..." : "Upload flyer"}
          </p>
          <p className="max-w-xs text-center text-xs text-muted-foreground">
            {describeAllowedFlyerTypes()}
          </p>
          <input
            id="flyer-upload"
            type="file"
            accept={flyerAcceptAttribute()}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      ) : null}

      {canManage && flyerUrl ? (
        <p className="text-xs text-muted-foreground">
          Remove this flyer first if you need to publish a different file.
        </p>
      ) : null}
    </div>
  );
}
