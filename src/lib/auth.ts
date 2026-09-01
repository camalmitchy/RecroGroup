import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

import { prisma } from "@/lib/prisma";

const appUrl =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: appUrl,
  trustedOrigins: [
    appUrl,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ].filter((origin, index, origins) => origins.indexOf(origin) === index),
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
