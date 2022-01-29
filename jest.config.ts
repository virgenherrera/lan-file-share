/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

const testType = {
  path: 'unit-test',
  name: 'Unit Test',
};
const reporters = [
  'default',
  [
    'jest-stare',
    {
      resultDir: `reports/${testType.path}`,
      resultJson: `${testType.path}.json`,
      reportTitle: `${testType.name} Report`,
      reportHeadline: `${testType.name} Report`,
      coverageLink: `../../coverage/${testType.path}/index.html`,
    },
  ],
];

export default {
  collectCoverageFrom: [
    '**/*.ts',
    '!**/(index|main).ts',
    '!**/*.(builder|constants|dto|enum|interface|model|mock|module).ts',
    '!**/*.(model|schema).ts',
    '!**/*.int.spec.ts',
  ],
  coverageDirectory: `../coverage/${testType.path}`,
  coverageProvider: 'v8',
  coverageReporters: ['html-spa', 'text'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  maxWorkers: '50%',
  reporters,
  rootDir: 'src',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts', '!**/*.int.spec.ts'],
  transform: { '^.+\\.(t)s$': 'ts-jest' },
};
