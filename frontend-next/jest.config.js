// module.exports = {
//     // The root of your source code, typically /src
//     // `<rootDir>` is a token Jest substitutes
//     roots: ["<rootDir>/src"],
  
//     // Jest transformations -- this adds support for TypeScript
//     // using ts-jest
//     transform: {
//       "^.+\\.(ts|tsx)$": "ts-jest",
//     },
  
//     // Runs special logic, such as cleaning up components
//     // when using React Testing Library and adds special
//     // extended assertions to Jest
//     setupFilesAfterEnv: [
//     //   "@testing-library/react/cleanup-after-each",
//     //   "@testing-library/jest-dom/extend-expect"
//     ],
  
//     // Test spec file resolution pattern
//     // Matches parent folder `__tests__` and filename
//     // should contain `test` or `spec`.
//     testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  
//     // Module file extensions for importing
//     moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
//   };

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(test).ts?(x)"],
    transform: {
        "^.+\\.(js|ts)$": "ts-jest",
    },
    transformIgnorePatterns: [
        "/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.js$",
        "/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.ts$",
        "/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.tsx$",
    ],
}