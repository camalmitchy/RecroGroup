import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Fallback lets `prisma generate` run in CI before env is injected; runtime uses DATABASE_URL.
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/recro?schema=public",
  },
});
