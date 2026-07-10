import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    // Pure-logic tests run in node; component tests (*.test.tsx) opt into jsdom.
    environment: "node",
    environmentMatchGlobs: [["src/**/*.test.tsx", "jsdom"]],
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/lib/**", "src/components/ui/**"],
      exclude: ["**/*.test.{ts,tsx}", "src/test/**"],
    },
  },
  esbuild: {
    // Match Next.js: use the automatic JSX runtime so tests don't need React
    // imported in scope.
    jsx: "automatic",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
