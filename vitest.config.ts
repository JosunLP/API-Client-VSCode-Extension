import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["webview/**/*.{js,jsx,ts,tsx}"],
      exclude: [
        "node_modules/",
        "webview/__test__/",
        "**/*.test.{js,jsx,ts,tsx}",
        "**/*.d.ts",
      ],
    },
    include: ["webview/__test__/**/*.test.{js,jsx,ts,tsx}"],
  },
  resolve: {
    alias: {
      path: "path-browserify",
      buffer: "buffer",
    },
  },
});
