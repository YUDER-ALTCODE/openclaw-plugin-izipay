import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    exclude: ["**/test-support/**", "**/dist/**", "**/node_modules/**"],
    globals: true,
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});