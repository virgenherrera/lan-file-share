import { Test, TestingModule } from '@nestjs/testing';
import { MockEnvConfigProvider } from '../../core/services/__mocks__';
import { AfterApplicationBootstrapService } from './after-application-bootstrap.service';

describe(`UT:${AfterApplicationBootstrapService.name}`, () => {
  const enum should {
    createInstance = 'Should create an instance of AfterApplicationBootstrapService properly.',
    callOnApplicationBootstrap = 'Should call onApplicationBootstrap properly.',
  }

  let service: AfterApplicationBootstrapService = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockEnvConfigProvider, AfterApplicationBootstrapService],
    }).compile();

    service = module.get(AfterApplicationBootstrapService);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(AfterApplicationBootstrapService);
  });

  it(should.callOnApplicationBootstrap, async () => {
    expect(service.onApplicationBootstrap).toBeDefined();
    expect(() => service.onApplicationBootstrap()).not.toThrow();
  });
});
