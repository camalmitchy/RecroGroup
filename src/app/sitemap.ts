import type { MetadataRoute } from "next";

import { serviceNavItems } from "@/shared/components/site-shell/nav-config";

function origin() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.BETTER_AUTH_URL?.trim() ||
    "https://recrogroup.org";
  const withProtocol = raw.includes("://") ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, "");
}

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/services",
  "/grief-camp",
  "/resources",
  "/insights",
  "/media",
  "/merchandise",
  "/contact",
  "/faq",
  "/booking",
  "/sponsor-child",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = origin();
  const lastModified = new Date();

  const servicePaths = serviceNavItems.map((item) => `/services/${item.slug}`);

  return [...PUBLIC_PATHS, ...servicePaths].map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified,
  }));
}
