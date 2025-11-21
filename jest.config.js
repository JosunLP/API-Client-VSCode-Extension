module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["webview/**/*.{js,jsx,ts,tsx}"],
  coverageDirectory: "coverage",
  moduleNameMapper: {
    "^.+\\.(svg|png|jpg)$": "jest-transform-stub",
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.[jt]sx?$": [
      "babel-jest",
      {
        presets: [
          ["@babel/preset-env", { targets: { node: "current" } }],
          ["@babel/preset-react", { runtime: "automatic" }],
          "@babel/preset-typescript",
        ],
      },
    ],
    "^.+\\.svg$": "jest-transform-stub",
  },
  testMatch: ["**/__test__/**/*.test.[jt]s?(x)"],
};
