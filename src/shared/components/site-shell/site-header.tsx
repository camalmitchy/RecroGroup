"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
            className="hidden rounded-full lg:inline-flex"
            size="lg"
          >
            <Link href="/booking">Book a Session</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="hidden rounded-full border-2 lg:inline-flex"
            size="lg"
          >
            <Link href="/login">
              <ArrowRight className="mr-2 size-4" />
              Sign in
            </Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
