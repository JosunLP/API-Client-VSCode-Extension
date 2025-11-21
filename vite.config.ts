import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Refresh for better development experience
      fastRefresh: true,
    }),
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
        bundle: resolve(__dirname, "webview/index.tsx"),
        sidebar: resolve(__dirname, "webview/sidebar.tsx"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        manualChunks: {
          // Split large dependencies into separate chunks
          react: ["react", "react-dom"],
          monaco: ["@monaco-editor/react"],
          ui: ["styled-components", "react-icons", "react-spinners"],
          vendors: ["axios", "zustand", "use-debounce"],
        },
      },
    },
    sourcemap: "hidden",
    chunkSizeWarningLimit: 1000,
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
