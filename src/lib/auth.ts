import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

import { prisma } from "@/lib/prisma";

const PRODUCTION_HOST = "recro-group.vercel.app";
const isVercel = Boolean(process.env.VERCEL);

function hostFromUrl(value: string | undefined) {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    return url.host || null;
  } catch {
    return null;
  }
}

function isLoopbackUrl(value: string) {
  const host = hostFromUrl(value)?.split(":")[0];
  return host === "localhost" || host === "127.0.0.1";
}

function uniqueHosts(hosts: Array<string | null | undefined>) {
  return [...new Set(hosts.filter((host): host is string => Boolean(host)))];
}

function originFromUrl(value: string | undefined) {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    return url.origin;
  } catch {
    return null;
  }
}

const configuredUrl =
  process.env.BETTER_AUTH_URL?.trim() ||
  process.env.NEXT_PUBLIC_APP_URL?.trim();

const fallbackUrl =
  configuredUrl && !isLoopbackUrl(configuredUrl)
    ? configuredUrl
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : isVercel || process.env.NODE_ENV === "production"
        ? `https://${PRODUCTION_HOST}`
        : "http://localhost:3000";

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim(),
  baseURL: {
    allowedHosts: uniqueHosts([
      "localhost:3000",
      "127.0.0.1:3000",
      "localhost:*",
      PRODUCTION_HOST,
      "*.vercel.app",
      hostFromUrl(configuredUrl),
      process.env.VERCEL_URL,
    ]),
    fallback: fallbackUrl,
    protocol: isVercel || process.env.NODE_ENV === "production" ? "https" : "auto",
  },
  trustedOrigins: uniqueHosts([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    `https://${PRODUCTION_HOST}`,
    "https://*.vercel.app",
    originFromUrl(configuredUrl),
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ]),
  advanced: {
    trustedProxyHeaders: isVercel,
    useSecureCookies: isVercel,
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: isVercel,
      path: "/",
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      const { sendEmail } = await import("@/lib/mail");
      const { passwordReset } = await import("@/lib/mail/templates");
      await sendEmail(
        passwordReset({
          recipientEmail: user.email,
          recipientName: user.name,
          url,
        }),
      );
    },
  },
  socialProviders: {
    ...(googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {}),
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      accountType: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
        input: false,
      },
      commsEmail: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: true,
      },
      commsSms: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: true,
      },
    },
  },
  plugins: [
    admin({
      defaultRole: "customer",
      adminRoles: ["admin"],
      // receptionist uses `user.role` string + app RBAC in permissions.ts
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
