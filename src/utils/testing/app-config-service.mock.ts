import { Provider } from '@nestjs/common';
import { Environment } from '../../core/enums';
import { AppConfigService } from '../../core/services';

export const mockAppConfigService = {
  port: 0,
  environment: Environment.test,
  openApi: {
    buildFlag: true,
    attachFlag: true,
    path: 'docs/',
  },
  get: jest.fn(),
} as unknown as AppConfigService;

export const MockAppConfigServiceProvider: Provider = {
  provide: AppConfigService,
  useValue: mockAppConfigService,
};
