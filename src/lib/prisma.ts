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
      throw new Error("DATABASE_URL environment variable is not set");
    }

    globalForPrisma.pool = new Pool({ connectionString });
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
