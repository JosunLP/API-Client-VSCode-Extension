# Changelog

## 1.2.0

#### Modernize build system, improve architecture, and enhance code quality

**Build System & Dependencies:**
- Migrate from Webpack to Vite for faster builds (~45% improvement)
- Migrate from Jest to Vitest for better Vite integration
- **Migrate from CommonJS to ES Modules (ESM)** for modern JavaScript standards
- Update ESLint to v9 with flat config format
- Update React, Zustand, and other core dependencies
- Improve TypeScript configuration for modern module resolution
- Add terser optimization for better minification
- Reduce extension bundle size by 78% (218 KB → 47.58 KB)
- Reduce webview bundle size by 53% (8.4 MB → 3.95 MB)
- Add code splitting for optimal chunk sizes
- Fix deprecated zustand import patterns

**Code Quality & Architecture:**
- Fix typo in ExtensionStateManager class name (was ExtentionStateManager)
- Use TypeScript `import type` syntax for type-only imports
- Add missing global variables to ESLint config (setTimeout, URLSearchParams, FormData, etc.)
- Improve no-unused-vars ESLint rule to better handle TypeScript patterns
- Add `"type": "module"` to package.json for proper ES module handling
- Configure Vite to output ES modules (`formats: ["es"]`) instead of CommonJS

**Security:**
- Fix all security vulnerabilities in dependencies (0 vulnerabilities)
- Update brace-expansion and semver packages to secure versions

**Performance & Bundle Optimization:**
- Implement improved manual chunking strategy for better code organization
- Separate postman-code-generators (2.9 MB) into dedicated chunk
- Lazy load postman-code-generators only when code snippet feature is used
- Better organize chunks: react, monaco, ui, vendors, postman, vendor-libs
- Reduce initial bundle load time by deferring heavy dependencies

## 1.1.4

#### Migrate project code from javascript to typescript

## 1.1.3

#### Change README Style

## 1.1.2

#### Fix Bug

## 1.1.1

#### Add JSON File uploading feature

## 1.1.0

#### Add feature to load JSON files for params, headers and body

## 1.0.9

#### Feature change VSCode extension theme to match various VSCode theme

## 1.0.8

#### Feature CI/CD github actions to deploy vscode extension to marketplace

## 1.0.7

#### Feature Clicking history collection from sidebar now fills up the UI in main request panel

## 1.0.6

#### Fix README displaying anchor tag in VSCode marketplace due to wrong way of closing anchor tag

## 1.0.5

#### README update

## 1.0.4

#### Fix POST body being converted to JSON string before sending to server

## 1.0.3

#### Fix response header menu not displaying the whole header information

## 1.0.2

#### README update

## 1.0.1

#### README update

## 1.0.0

#### Initial Release
