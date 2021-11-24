/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: ['./node_modules', './dist'],
  collectCoverageFrom: ['**/*.{js,jsx}', '!**/node_modules/**'],
};
