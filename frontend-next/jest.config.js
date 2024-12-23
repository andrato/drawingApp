const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
    moduleNameMapper: {
        // Handle module aliases (this will be automatically configured for you soon)
        '^@/components/(.*)$': '<rootDir>/src',

        '^@/pages/(.*)$': '<rootDir>/src',
    },
    testEnvironment: 'jest-environment-jsdom',
    collectCoverage: true,
    // on node 14.x coverage provider v8 offers good speed and more or less good report
    coverageProvider: 'v8',
    collectCoverageFrom: [
      '<rootDir>/src/components/draw/*.{js,jsx,ts,tsx}',
      '<rootDir>/src/components/home/*.{js,jsx,ts,tsx}',
      '!**/*.d.ts',
      '!**/node_modules/**',
      '!<rootDir>/out/**',
      '!<rootDir>/.next/**',
      '!<rootDir>/*.config.js',
      '!<rootDir>/coverage/**',
    ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)

// module.exports = {
//     collectCoverage: true,
//     // on node 14.x coverage provider v8 offers good speed and more or less good report
//     coverageProvider: 'v8',
//     collectCoverageFrom: [
//       '**/*.{js,jsx,ts,tsx}',
//       '!**/*.d.ts',
//       '!**/node_modules/**',
//       '!<rootDir>/out/**',
//       '!<rootDir>/.next/**',
//       '!<rootDir>/*.config.js',
//       '!<rootDir>/coverage/**',
//     ],
//     moduleNameMapper: {
//       // Handle CSS imports (with CSS modules)
//       // https://jestjs.io/docs/webpack#mocking-css-modules
//       '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
   
//       // Handle CSS imports (without CSS modules)
//       '^.+\\.(css|sass|scss)$': '<rootDir>/tests/mocks/styleMock.js',
   
//       // Handle image imports
//       // https://jestjs.io/docs/webpack#handling-static-assets
//       '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i': `<rootDir>/__mocks__/fileMock.js`,
   
//       // Handle module aliases
//       '^@/components/(.*)$': '<rootDir>/components/$1',
//     },
//     // Add more setup options before each test is run
//     // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
//     testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
//     testEnvironment: 'jsdom',
//     transform: {
//       // Use babel-jest to transpile tests with the next/babel preset
//       // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
//       '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
//     },
//     transformIgnorePatterns: [
//       '/node_modules/',
//       '^.+\\.module\\.(css|sass|scss)$',
//     ],
//   };