/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/test/**/*.test.ts'],
  transform: { '^.+\\.(ts|tsx)$': 'babel-jest' },
  maxWorkers: 1,
  runInBand: true,
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: 'v8', // works better in StackBlitz
  collectCoverageFrom: [
    'app/controller/**/*.ts',
    'app/utils/**/*.ts',
    'app/models/**/*.ts',
    'app/middlewares/**/*.ts',
  ],
  coverageDirectory: 'coverage',
};
