/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/test/**/*.test.ts'],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'app/controller/**/*.ts',
    'app/utils/**/*.ts',
    'app/models/**/*.ts',
    'app/middlewares/**/*.ts',
  ],
  coverageDirectory: 'coverage',
};
