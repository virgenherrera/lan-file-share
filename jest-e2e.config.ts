import type { Config } from '@jest/types';
import { BaseConfig } from './jest.config';

export const e2eConfig: Config.InitialOptions = {
  ...BaseConfig,
  collectCoverageFrom: [
    ...BaseConfig.collectCoverageFrom,
    '!**/environment.service.ts',
    '!**/dto-validation.pipe.ts',
    '!**/*.(config|spec).ts',
    '!(dist|test)/**',
    '!src/utils/**',
    '!src/chat/**', //drop this once e2e written
  ],
  coverageDirectory: 'coverage/e2e',
  maxWorkers: 1,
  rootDir: './',
  testPathIgnorePatterns: [
    '/coverage/',
    '/dist/',
    '/node_modules/',
    '/public/',
    '/src/',
  ],
  testRegex: '.e2e-spec.ts$',
};

export default e2eConfig;
