import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Enable polyfills for specific globals and modules
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: false, // Don't empty dist folder to preserve extension.js
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for debugging
        drop_debugger: true,
      },
    },
    rollupOptions: {
      input: {
        bundle: resolve(__dirname, "webview/index.html"),
        sidebar: resolve(__dirname, "webview/sidebar.html"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        manualChunks: (id) => {
          // Split large dependencies into separate chunks
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "react";
            }
            if (id.includes("@monaco-editor") || id.includes("monaco-editor")) {
              return "monaco";
            }
            if (
              id.includes("styled-components") ||
              id.includes("react-icons") ||
              id.includes("react-spinners")
            ) {
              return "ui";
            }
            if (
              id.includes("postman-collection") ||
              id.includes("postman-code-generators")
            ) {
              return "postman";
            }
            if (
              id.includes("axios") ||
              id.includes("zustand") ||
              id.includes("use-debounce")
            ) {
              return "vendors";
            }
            // Other node_modules go to vendors
            return "vendor-libs";
          }
        },
      },
    },
    sourcemap: "hidden",
    chunkSizeWarningLimit: 2000, // Increase limit since we're splitting chunks properly
    reportCompressedSize: true,
  },
  resolve: {
    alias: {
      path: "path-browserify",
      buffer: "buffer",
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "styled-components"],
    exclude: ["@vscode"],
  },
});
