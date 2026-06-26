import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";

import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
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
        input: true,
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
  ],
});

export type Session = typeof auth.$Infer.Session;
