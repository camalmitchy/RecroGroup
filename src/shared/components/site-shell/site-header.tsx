"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { SiteLogo } from "./site-logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <SiteLogo />
        <DesktopNav />
        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden rounded-full sm:inline-flex"
            size="lg"
          >
            <Link href="/join-us">Join Us</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
