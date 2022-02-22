/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html

*/

const reporters: any[] = ['default'];

if (process.argv.includes('--coverage')) {
  reporters.push([
    'jest-stare',
    {
      resultDir: `reports/html/test-execution`,
      resultJson: `test-execution.json`,
      reportTitle: `Tests Report`,
      reportHeadline: `Unit/Integration Test Report`,
      coverageLink: `../test-coverage/index.html`,
    },
  ]);
}

export default {
  collectCoverageFrom: [
    '**/*.ts',
    '!**/(index|main).ts',
    '!**/*.(builder|constants|dto|enum|interface|model|mock|module).ts',
    '!**/*.(model|schema).ts',
  ],
  coverageDirectory: `../reports/html/test-coverage`,
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
  maxWorkers: '95%',
  reporters,
  rootDir: 'src',
  testEnvironment: 'node',
  testMatch: ['**/*spec.ts'],
  transform: { '^.+\\.(t)s$': 'ts-jest' },
};
