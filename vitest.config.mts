import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const serverOnlyStub = fileURLToPath(new URL("./test/server-only-stub.ts", import.meta.url));
const srcRoot = fileURLToPath(new URL("./src", import.meta.url));

const resolve = {
  alias: {
    "server-only": serverOnlyStub,
    "@": srcRoot,
  },
} as const;

export default defineConfig({
  test: {
    projects: [
      {
        resolve,
        test: {
          name: "node",
          environment: "node",
          include: ["src/**/__tests__/**/*.test.ts"],
        },
      },
      {
        resolve,
        plugins: [react()],
        test: {
          name: "jsdom",
          environment: "jsdom",
          globals: true,
          setupFiles: ["./test/setup.ts"],
          include: ["src/**/__tests__/**/*.test.tsx"],
        },
      },
    ],
  },
});
