import { Test, TestingModule } from '@nestjs/testing';
import {
  mockAppConfigService,
  MockAppConfigServiceProvider,
  MockLoggerProvider,
} from '../../../utils/testing';
import { SystemHealth } from '../../models';
import { HealthService } from './health.service';

describe('UT:HealthService', () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    getHealth = 'should get SystemHealth.',
  }
  let service: HealthService = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        MockLoggerProvider,
        MockAppConfigServiceProvider,
      ],
    }).compile();

    service = module.get(HealthService);
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(HealthService);
  });

  it(should.getHealth, () => {
    const maxLoad = 3;
    let systemHealth: SystemHealth = null;

    mockAppConfigService.get = jest.fn().mockReturnValue(maxLoad);

    expect(() => (systemHealth = service.getHealth())).not.toThrow();
    expect(systemHealth).not.toBeNull();
    expect(systemHealth).toBeInstanceOf(SystemHealth);
    expect(systemHealth.maxLoad).toEqual(maxLoad);
  });
});
