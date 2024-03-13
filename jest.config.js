/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/toto.ts'],
  // testMatch: ['**/__tests__/**/*.spec.ts', '**/__tests__/**/*.test.ts'],
}
