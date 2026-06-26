import Image from "next/image";
import Link from "next/link";

import { SiteLogo } from "@/shared/components/site-shell/site-logo";

type AuthSplitLayoutProps = {
  imageSrc: string;
  imageAlt: string;
  quote?: {
    text: string;
    author?: string;
  };
  children: React.ReactNode;
};

export function AuthSplitLayout({
  imageSrc,
  imageAlt,
  quote,
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative hidden min-h-screen w-[70%] lg:block">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
          sizes="70vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/25 to-foreground/10" />
        {quote ? (
          <div className="absolute right-12 bottom-12 left-12 max-w-lg text-background">
            <p className="font-serif text-2xl leading-snug tracking-tight md:text-3xl">
              &ldquo;{quote.text}&rdquo;
            </p>
            {quote.author ? (
              <p className="mt-4 text-sm text-background/85">{quote.author}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex min-h-screen w-full flex-col lg:w-[30%]">
        <div className="flex items-center justify-between px-6 pt-8 lg:px-10">
          <SiteLogo />
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to site
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 lg:px-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
