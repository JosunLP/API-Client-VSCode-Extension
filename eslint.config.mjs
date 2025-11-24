import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["out", "dist", "**/*.d.ts", "node_modules", "coverage"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      "simple-import-sort": simpleImportSort,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "no-const-assign": "warn",
      "no-this-before-super": "warn",
      "no-undef": "off", // TypeScript handles this
      "no-unreachable": "warn",
      "no-unused-vars": "off", // TypeScript handles this
      "@typescript-eslint/no-unused-vars": "warn",
      "constructor-super": "warn",
      "valid-typeof": "warn",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
);
