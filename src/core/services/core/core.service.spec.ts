import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockAppConfigService,
  MockAppConfigServiceProvider,
  MockLoggerProvider,
} from '../../../utils/testing';
import { SystemHealth } from '../../models';
import { CoreService } from './core.service';

describe('UT:CoreService', () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    getHealth = 'should get SystemHealth.',
    validateAppCredentials = `Should validateAppCredentials() with good credentials.`,
    validateBadAppCredentials = `Should validateAppCredentials() with bad credentials.`,
  }
  let service: CoreService = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreService,
        MockLoggerProvider,
        MockAppConfigServiceProvider,
      ],
    }).compile();

    service = module.get(CoreService);
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(CoreService);
  });

  it(should.getHealth, async () => {
    await expect(service.getHealth()).resolves.toBeInstanceOf(SystemHealth);
  });

  it(should.validateAppCredentials, () => {
    const mockEnv = {
      APP_USER: 'fake-user',
      APP_PASS: 'fake-password',
    };

    mockAppConfigService.get = jest
      .fn()
      .mockImplementation((key: keyof typeof mockEnv) => mockEnv[key]);

    expect(() =>
      service.validateAppCredentials('fake-user', 'fake-password'),
    ).not.toThrow();
  });

  it(should.validateBadAppCredentials, () => {
    const mockEnv = {
      APP_USER: 'fake-user',
      APP_PASS: 'fake-password',
    };

    mockAppConfigService.get = jest
      .fn()
      .mockImplementation((key: keyof typeof mockEnv) => mockEnv[key]);

    expect(() =>
      service.validateAppCredentials('fake-other-user', 'fake-other-password'),
    ).toThrowError(UnauthorizedException);
  });
});
