import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Environment } from '../../enums';
import { AppConfigService } from './app-config.service';

describe('UT:AppConfigService', () => {
  const enum should {
    createInstance = 'create instance Properly and set environment to Default.',
    getPort = `Should getPort provided in NODE_ENV.`,
    getOpenApi = `Should getPort provided in NODE_ENV.`,
  }
  const MockConfigModule = {
    get: jest.fn(),
  };
  let service: AppConfigService = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        { provide: ConfigService, useValue: MockConfigModule },
        AppConfigService,
      ],
    }).compile();

    service = module.get(AppConfigService);
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(AppConfigService);
    expect(service.environment).toEqual(Environment.development);
  });

  it(should.getPort, () => {
    const mockPORT = '3333';
    let port: number = null;

    MockConfigModule.get = jest.fn().mockReturnValue(mockPORT);

    expect(() => (port = service.port)).not.toThrow();
    expect(port).not.toBeNull();
    expect(port).not.toBeNaN();
    expect(port).toEqual(3333);
  });

  it(should.getOpenApi, () => {
    const mockEnv = {
      APP_OPEN_API: 'true',
      APP_OPEN_API_ATTACH: 'true',
      APP_OPEN_API_PATH: 'fake-path/',
    };
    let openApiRes: any = null;

    MockConfigModule.get = jest
      .fn()
      .mockImplementation((key: keyof typeof mockEnv) => mockEnv[key]);

    expect(() => (openApiRes = service.openApi)).not.toThrow();
    expect(openApiRes).not.toBeNull();
    expect(openApiRes).toHaveProperty('buildFlag');
    expect(openApiRes).toHaveProperty('attachFlag');
    expect(openApiRes).toHaveProperty('path');
    expect(openApiRes.buildFlag).toBe(true);
    expect(openApiRes.attachFlag).toBe(true);
    expect(openApiRes.path).toBe(mockEnv.APP_OPEN_API_PATH);
  });
});
