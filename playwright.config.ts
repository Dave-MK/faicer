import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: process.env.PLAYWRIGHT_OUTPUT_DIR ?? "test-results",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3001",
    headless: true,
  },
});
