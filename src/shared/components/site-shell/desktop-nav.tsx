"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

import { mainNavLinks, serviceNavItems } from "./nav-config";

function NavLinkItem({
  href,
  label,
  exact,
}: {
  href: string;
  label: string;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            navigationMenuTriggerStyle(),
            "rounded-full",
            isActive && "bg-primary/10 text-primary",
          )}
        >
          {label}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

export function DesktopNav() {
  const pathname = usePathname();
  const servicesActive = pathname.startsWith("/services");

  return (
    <NavigationMenu className="hidden lg:flex" viewport={false}>
      <NavigationMenuList className="gap-0.5">
        <NavLinkItem href="/" label="Home" exact />
        <NavLinkItem href="/grief-camp" label="Grief Camp" />

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "rounded-full",
              servicesActive && "bg-primary/10 text-primary",
            )}
          >
            Services
          </NavigationMenuTrigger>
          <NavigationMenuContent className="w-80 p-2">
            <ul className="grid gap-1">
              {serviceNavItems.map((service) => (
                <li key={service.slug}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={`/services/${service.slug}`}
                      className="flex items-start gap-3 rounded-xl p-3 hover:bg-muted"
                    >
                      <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Image
                          src={service.icon}
                          alt=""
                          width={20}
                          height={20}
                          className="size-5 object-contain"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-foreground">
                          {service.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {service.description}
                        </span>
                      </span>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
            <div className="mt-1 border-t border-border px-3 py-2">
              <Link
                href="/services"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all services →
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {mainNavLinks
          .filter((link) => !["/", "/grief-camp"].includes(link.href))
          .map((link) => (
            <NavLinkItem
              key={link.href}
              href={link.href}
              label={link.label}
              exact={link.exact}
            />
          ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
