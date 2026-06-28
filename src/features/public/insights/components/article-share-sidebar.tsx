"use client";

import { Link2 } from "lucide-react";

type ArticleShareSidebarProps = {
  title: string;
};

function ShareButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary-deep"
    >
      {children}
    </button>
  );
}

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.368-1.85 3.598 0 4.268 2.368 4.268 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.123 2.062 2.062 0 0 1 0 4.123zM3.558 20.452h3.56V9h-3.56v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function ArticleShareSidebar({ title }: ArticleShareSidebarProps) {
  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <aside className="hidden lg:block">
      <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
        Share this
      </p>
      <div className="mt-4 flex flex-col gap-3">
        <ShareButton
          label="Share on LinkedIn"
          onClick={() =>
            window.open(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
              "_blank",
            )
          }
        >
          <LinkedinIcon size={16} />
        </ShareButton>
        <ShareButton
          label="Share on X"
          onClick={() =>
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
              "_blank",
            )
          }
        >
          <span className="text-sm font-semibold">X</span>
        </ShareButton>
        <ShareButton
          label="Copy link"
          onClick={() => {
            void navigator.clipboard.writeText(url);
          }}
        >
          <Link2 size={16} />
        </ShareButton>
      </div>
    </aside>
  );
}