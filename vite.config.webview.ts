import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    rollupOptions: {
      input: {
        bundle: path.resolve(__dirname, "webview/index.tsx"),
        sidebar: path.resolve(__dirname, "webview/sidebar.tsx"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        format: "es",
      },
    },
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
  },
});
