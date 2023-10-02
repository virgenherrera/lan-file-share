/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html

*/
import type { Config } from '@jest/types';

export const BaseConfig: Config.InitialOptions = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.ts',
    '!**/(index|main|openApi).ts',
    '!**/*.(builder|constant|dto|doc|enum|exception|import|interface|mock|module|strategy).ts',
    '!**/*.(model|schema).ts',
    '!**/__mocks__.ts',
    '!src/chat/**', //drop this once e2e written
  ],
  coverageDirectory: '../coverage/unit',
  coverageProvider: 'v8',
  coverageReporters: ['text', 'html-spa'],
  coverageThreshold: {
    global: { branches: 85, functions: 85, lines: 85, statements: 85 },
  },
  maxWorkers: '100%',
  reporters: ['default', 'summary', 'github-actions'],
  rootDir: 'src',
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  transform: { '^.+\\.ts$': 'ts-jest' },
  verbose: false,
};

export default BaseConfig;
