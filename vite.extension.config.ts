import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/extension.ts"),
      formats: ["es"],
      fileName: () => "extension.js",
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for debugging extension issues
        drop_debugger: true,
      },
    },
    rollupOptions: {
      external: [
        "vscode",
        "fs",
        "path",
        "util",
        "os",
        "crypto",
        "stream",
        "http",
        "https",
        "url",
        "zlib",
        "events",
        "buffer",
        "string_decoder",
        "querystring",
        "assert",
        "net",
        "tls",
        "child_process",
      ],
      output: {
        entryFileNames: "[name].js",
      },
    },
    sourcemap: process.env.NODE_ENV === "production" ? "hidden" : "inline",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
});
