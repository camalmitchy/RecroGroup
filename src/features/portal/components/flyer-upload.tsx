"use client";

import { useState } from "react";
import { Upload, Download, Trash2, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface FlyerUploadProps {
  currentUrl: string | null;
}

export function FlyerUpload({ currentUrl }: FlyerUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [flyerUrl, setFlyerUrl] = useState(currentUrl);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload an image or PDF file.");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size exceeds 10MB limit.");
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      setFlyerUrl(data.url);
      setPreviewUrl(data.url);
      toast.success("Flyer uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const getFileExtension = (url: string | null) => {
    if (!url) return null;
    return url.split(".").pop()?.toLowerCase();
  };

  const isPDF = (url: string | null) => {
    return getFileExtension(url) === "pdf";
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
      <div className="mb-6">
        <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
          Grief Camp 2027 Flyer
        </h3>
        <p className="text-sm text-muted-foreground">
          Upload a poster (image or PDF) that customers can download on the grief camp page.
        </p>
      </div>

      {/* Current Flyer Preview */}
      {flyerUrl && (
        <div className="mb-6 rounded-2xl border border-border bg-muted/30 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {isPDF(flyerUrl) ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <FileText size={24} />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <ImageIcon size={24} />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-foreground">Current Flyer</p>
                <p className="text-xs text-muted-foreground">
                  {isPDF(flyerUrl) ? "PDF Document" : "Image File"}
                </p>
              </div>
            </div>
            <a
              href={flyerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-deep px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-deep/90"
            >
              <Download size={16} />
              Preview
            </a>
          </div>

          {/* Image Preview */}
          {!isPDF(flyerUrl) && previewUrl && (
            <div className="rounded-xl overflow-hidden border border-border">
              <img
                src={previewUrl}
                alt="Grief Camp Flyer"
                className="w-full h-auto max-h-96 object-contain bg-white"
              />
            </div>
          )}
        </div>
      )}

      {/* Upload Section */}
      <div className="space-y-4">
        <label
          htmlFor="flyer-upload"
          className={`
            flex flex-col items-center justify-center rounded-2xl border-2 border-dashed
            ${uploading ? "border-muted bg-muted/20" : "border-border bg-muted/10 hover:bg-muted/20 cursor-pointer"}
            px-6 py-10 transition-colors
          `}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary-deep mb-4">
            <Upload size={28} />
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">
            {uploading ? "Uploading..." : flyerUrl ? "Replace Flyer" : "Upload Flyer"}
          </p>
          <p className="text-xs text-muted-foreground text-center max-w-xs">
            JPG, PNG, WebP or PDF (max 10MB)
          </p>
          <input
            id="flyer-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {flyerUrl && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            <span>Current flyer will be replaced</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 rounded-xl bg-blue-50 border border-blue-200 p-4">
        <p className="text-xs text-blue-900 leading-relaxed">
          <strong>Note:</strong> The uploaded flyer will be immediately available for download
          on the public grief camp page. Customers will see a "Download 2027 Camp Flyer" button.
        </p>
      </div>
    </div>
  );
}
