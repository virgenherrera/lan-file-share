import { INestApplication, Provider } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import { MockLoggerProvider } from '../utils/testing';
import { CoreModule } from './core.module';
import { CoreRoute, Environment } from './enums';
import { AppConfigService } from './services';

const mockAppConfigService = {
  environment: Environment.test,
  port: 0,
  openApiPath: 'dist/fake-path/',
  get: jest.fn(),
};

export const MockAppConfigService: Provider = {
  provide: AppConfigService,
  useValue: mockAppConfigService,
};

describe(`Integration ${CoreModule.name}`, () => {
  const enum should {
    initModule = 'Should init Module Properly.',
    getHealth = `Should GET appHealth.`,
  }

  let app: INestApplication = null;

  beforeAll(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
      providers: [MockLoggerProvider],
    })
      .overrideProvider(MockAppConfigService.provide)
      .useValue(MockAppConfigService.useValue)
      .compile();

    app = testingModule.createNestApplication();
    await app.init();
  });

  it(should.initModule, async () => {
    expect(app).not.toBeNull();
    expect(app).toBeInstanceOf(NestApplication);
  });

  it(should.getHealth, async () => {
    const { status, body } = await supertest(app.getHttpServer()).get(
      CoreRoute.health,
    );

    expect(status).toBe(200);
    expect(body).toMatchObject({
      cpuUsage: expect.any(String),
      memoryUsage: expect.any(String),
      uptime: expect.any(String),
      uptimeSince: expect.any(String),
    });
  });
});
