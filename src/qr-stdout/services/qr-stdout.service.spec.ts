import { Test, TestingModule } from '@nestjs/testing';
import { MockEnvironmentProvider } from '../../common/services/__mocks__';
import { QrStdoutService } from './qr-stdout.service';

describe(`UT:${QrStdoutService.name}`, () => {
  const enum should {
    createInstance = 'Should create an instance of AfterApplicationBootstrapService properly.',
    callOnApplicationBootstrap = 'Should call onApplicationBootstrap properly.',
  }

  let service: QrStdoutService = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockEnvironmentProvider, QrStdoutService],
    }).compile();

    service = module.get(QrStdoutService);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(QrStdoutService);
  });

  it(should.callOnApplicationBootstrap, async () => {
    expect(service.onApplicationBootstrap).toBeDefined();
    expect(() => service.onApplicationBootstrap()).not.toThrow();
  });
});
