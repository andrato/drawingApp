/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // The root directory that Jest should scan for tests and modules within
  rootDir: ".",

  // A list of paths to directories that Jest should use to search for files in
  roots: ["<rootDir>/src"],

  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],

  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
  },

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 20,
      lines: 60,
      statements: 60
    }
  },
};