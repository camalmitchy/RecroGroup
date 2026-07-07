import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
  pool: Pool;
};

function getPool() {
  if (!globalForPrisma.pool) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      // During build time or when DATABASE_URL is not set,
      // create a placeholder pool to allow the build to succeed
      console.warn("DATABASE_URL not set - using placeholder connection");
      globalForPrisma.pool = new Pool({
        connectionString: "postgresql://placeholder:placeholder@localhost:5432/placeholder",
        // Don't actually try to connect during build
        max: 0,
      });
    } else {
      globalForPrisma.pool = new Pool({ connectionString });
    }
  }

  return globalForPrisma.pool;
}

function createPrismaClient() {
  const adapter = new PrismaPg(getPool());

  return new PrismaClient({
    adapter,
    // log:
    //   process.env.NODE_ENV === "development"
    //     ? ["query", "error", "warn"]
    //     : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
