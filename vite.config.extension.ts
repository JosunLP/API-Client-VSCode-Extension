import { builtinModules } from "module";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "node20",
    lib: {
      entry: path.resolve(__dirname, "src/extension.ts"),
      fileName: () => "extension.js",
      formats: ["cjs"],
    },
    rollupOptions: {
      external: [
        "vscode",
        ...builtinModules,
        ...builtinModules.map((m) => `node:${m}`),
      ],
    },
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
  },
});
