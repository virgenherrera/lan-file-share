import { Test, TestingModule } from '@nestjs/testing';
import { MockLoggerProvider } from '../../utils/testing';
import { SystemHealth } from '../models';
import { HealthService, LogFileService } from '../services';
import { CoreController } from './core.controller';

describe('UT:CoreController', () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    getHealth = `Should getHealth.`,
  }

  const mockHealthService = {
    getHealth: jest.fn().mockReturnThis(),
  } as unknown as HealthService;
  const mockLogFileService = {
    getLogFile: jest.fn().mockReturnThis(),
  } as unknown as LogFileService;
  let controller: CoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoreController],
      providers: [
        { provide: HealthService, useValue: mockHealthService },
        { provide: LogFileService, useValue: mockLogFileService },
        MockLoggerProvider,
      ],
    }).compile();

    controller = module.get(CoreController);
  });

  it(should.createInstance, () => {
    expect(controller).not.toBeNull();
    expect(controller).toBeInstanceOf(CoreController);
  });

  it(should.getHealth, async () => {
    const mockHealth = new SystemHealth({
      cpuUsage: 'fake-cpuUsage',
      memoryUsage: 'fake-memoryUsage',
      uptime: 'fake-uptime',
      uptimeSince: 'fake-uptimeSince',
    });

    mockHealthService.getHealth = jest.fn().mockResolvedValue(mockHealth);

    await expect(controller.getHealth()).resolves.toBe(mockHealth);
  });
});
