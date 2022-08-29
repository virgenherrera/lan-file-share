import { mockEnvConfigService } from '../../src/core/services/__mocks__';

export const e2eMockENV = {
  SHARED_FOLDER_PATH: './dist/MOCK_SHARED_FOLDER',
};

export const mockE2eEnvConfigService: typeof mockEnvConfigService = {
  ...mockEnvConfigService,
  get: jest.fn().mockImplementation(envKey => e2eMockENV[envKey]),
};
