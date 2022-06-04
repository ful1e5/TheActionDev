module.exports = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/**/*.ts"],
  clearMocks: true,
  moduleFileExtensions: ["js", "ts"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest"
  }
};
