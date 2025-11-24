import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: "./",
  define: {
    "process.env": {},
    "process.platform": JSON.stringify("browser"),
    "process.version": JSON.stringify(""),
    "process.browser": true,
  },
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
        manualChunks: (id) => {
          // Separate postman-code-generators into its own chunk for lazy loading
          if (id.includes("postman-code-generators")) {
            return "code-generators";
          }
          // Separate Monaco editor into its own chunk
          if (id.includes("@monaco-editor")) {
            return "monaco-editor";
          }
          // Keep other large node_modules in a vendor chunk
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
  },
});
