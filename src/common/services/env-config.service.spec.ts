import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Environment } from '../enums';
import { EnvConfigService } from './env-config.service';

describe(`UT:${EnvConfigService.name}`, () => {
  const enum should {
    createInstance = 'create instance Properly and set environment to Default.',
    getOpenApi = `Should getOpenApi provided in NODE_ENV.`,
    getDefaultOpenApi = `Should default value for getOpenApi when not provided in NODE_ENV.`,
  }

  const mockNodeEnv = {
    NODE_ENV: Environment.test,
    APP_PORT: '3333',
  };
  const mockGetImplementation = (envKey: string) => mockNodeEnv[envKey];

  const MockConfigModule = {
    get: jest.fn().mockImplementation(mockGetImplementation),
  };
  const configServiceProvider = {
    provide: ConfigService,
    useValue: MockConfigModule,
  };
  let service: EnvConfigService = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [configServiceProvider, EnvConfigService],
    }).compile();

    service = module.get(EnvConfigService);
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(EnvConfigService);
    expect(service.environment).toEqual(mockNodeEnv.NODE_ENV);
    expect(service.port).not.toBeNull();
    expect(service.port).not.toBeNaN();
    expect(service.port).toBe(Number(mockNodeEnv.APP_PORT));
  });

  it(should.getOpenApi, () => {
    const mockEnv = {
      APP_OPEN_API_PATH: 'fake-path/',
    };

    MockConfigModule.get = jest
      .fn()
      .mockImplementation((key: keyof typeof mockEnv) => mockEnv[key]);

    expect(service.openApiPath).toBe(mockEnv.APP_OPEN_API_PATH);
  });

  it(should.getDefaultOpenApi, () => {
    const mockEnv = {};

    MockConfigModule.get = jest
      .fn()
      .mockImplementation((key: keyof typeof mockEnv) => mockEnv[key]);

    expect(service.openApiPath).toBeTruthy();
  });
});
