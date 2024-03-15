/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '!**/tests/utils/utils.spec.ts',
    '!**/tests/resolvers/**/*.spec.ts',
    '**/tests/utils/trueTest.spec.ts',
  ],
}
