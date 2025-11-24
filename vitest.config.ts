import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./jest.setup.js"],
    include: [
      "webview/**/__test__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "src/**/__test__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    alias: {
      // Handle svg/png imports in tests if needed, though Vite handles them usually.
      // Jest config had: "^.+.(svg|png|jpg)$": "jest-transform-stub"
      // Vite handles assets by returning the path.
    },
  },
  resolve: {
    alias: {
      // Add aliases if used in the project
    },
  },
});
