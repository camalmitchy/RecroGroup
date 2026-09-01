import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
};

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL?.trim();

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env locally, or to Vercel Project Settings > Environment Variables, then redeploy.",
    );
  }

  return connectionString;
}

function shouldUseSsl(connectionString: string) {
  if (process.env.DATABASE_SSL === "false") return false;
  if (process.env.DATABASE_SSL === "true" || process.env.VERCEL) return true;

  try {
    const parsed = new URL(connectionString);
    const sslmode = parsed.searchParams.get("sslmode");

    if (sslmode === "disable") return false;
    if (
      sslmode === "require" ||
      sslmode === "verify-ca" ||
      sslmode === "verify-full"
    ) {
      return true;
    }

    const host = parsed.hostname;
    return (
      host.endsWith(".neon.tech") ||
      host.endsWith(".supabase.co") ||
      host.endsWith(".postgres.vercel-storage.com") ||
      host.includes("amazonaws.com") ||
      host.includes("render.com")
    );
  } catch {
    return Boolean(process.env.VERCEL);
  }
}

function createPrismaClient() {
  const connectionString = getConnectionString();
  const pool =
    globalForPrisma.pool ??
    new Pool({
      connectionString,
      max: process.env.VERCEL ? 1 : 10,
      ssl: shouldUseSsl(connectionString)
        ? { rejectUnauthorized: false }
        : undefined,
    });
  globalForPrisma.pool = pool;

  return new PrismaClient({
    adapter: new PrismaPg(pool),
  });
}

function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}

// Lazy client so importing this module during compile does not require env,
// and a missing DATABASE_URL fails on first query instead of a dummy pool.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
