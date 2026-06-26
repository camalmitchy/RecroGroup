"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { mainNavLinks, serviceNavItems } from "./nav-config";

function MobileNavLink({
  href,
  label,
  exact,
  onNavigate,
}: {
  href: string;
  label: string;
  exact?: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground hover:bg-muted",
      )}
    >
      {label}
    </Link>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1 px-1">
          <MobileNavLink href="/" label="Home" exact onNavigate={close} />
          <MobileNavLink
            href="/grief-camp"
            label="Grief Camp"
            onNavigate={close}
          />

          <Accordion type="single" collapsible className="border-none">
            <AccordionItem value="services" className="border-none">
              <AccordionTrigger className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-muted hover:no-underline">
                Services
              </AccordionTrigger>
              <AccordionContent className="grid gap-1 pb-0 pl-2 sm:grid-cols-2">
                {serviceNavItems.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    onClick={close}
                    className="rounded-lg px-3 py-2.5 transition-colors hover:bg-muted"
                  >
                    <span className="block text-sm font-medium text-foreground">
                      {service.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {service.description}
                    </span>
                  </Link>
                ))}
                <Link
                  href="/services"
                  onClick={close}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10"
                >
                  View all services →
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {mainNavLinks
            .filter((link) => !["/", "/grief-camp"].includes(link.href))
            .map((link) => (
              <MobileNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                exact={link.exact}
                onNavigate={close}
              />
            ))}

          <Button
            asChild
            variant="outline"
            className="mt-4 w-full rounded-full"
            size="lg"
          >
            <Link href="/login" onClick={close}>
              Sign in
            </Link>
          </Button>
          <Button asChild className="w-full rounded-full" size="lg">
            <Link href="/join-us" onClick={close}>
              Join Us
            </Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
