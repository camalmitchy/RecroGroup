"use client";

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

function ServiceListItem({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="line-clamp-2 text-muted-foreground">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export function DesktopNav() {
  const pathname = usePathname();
  const servicesActive = pathname.startsWith("/services");

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList className="gap-0.5">
        <NavLinkItem href="/" label="Home" exact />
        <NavLinkItem href="/about" label="About" />

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "rounded-full",
              servicesActive && "bg-primary/10 text-primary",
            )}
          >
            Services
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 p-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {serviceNavItems.map((service) => (
                <ServiceListItem
                  key={service.slug}
                  title={service.label}
                  href={`/services/${service.slug}`}
                >
                  {service.description}
                </ServiceListItem>
              ))}
            </ul>
            <div className="border-t border-border px-4 py-2.5">
              <NavigationMenuLink asChild>
                <Link
                  href="/services"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View all services →
                </Link>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {mainNavLinks
          .filter((link) => !["/", "/about"].includes(link.href))
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
