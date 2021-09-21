import { Test, TestingModule } from '@nestjs/testing';
import { MockLoggerProvider } from '../../utils/testing';
import { HealthService } from '../services';
import { HealthController } from './health.controller';

describe('UT:HealthController', () => {
  const enum should {
    createInstance = 'should create instance Properly.',
  }
  const mockHealthService: Record<keyof HealthService, any> = {
    getHealth: () => this,
  };
  let controller: HealthController = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthService, useValue: mockHealthService },
        MockLoggerProvider,
      ],
    }).compile();

    controller = module.get(HealthController);
  });

  it(should.createInstance, () => {
    expect(controller).not.toBeNull();
    expect(controller).toBeInstanceOf(HealthController);
  });
});
