import { Test, TestingModule } from '@nestjs/testing';
import { MockLoggerProvider } from '../../utils/testing';
import { LogFiltersDto } from '../dtos';
import { LogResponse, SystemHealth } from '../models';
import { CoreService } from '../services';
import { CoreController } from './core.controller';

describe('UT:CoreController', () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    getHealth = `Should getHealth().`,
    getLogs = `Should getLogs().`,
  }

  const mockHealthService = {
    getHealth: jest.fn().mockReturnThis(),
    getLogFile: jest.fn().mockReturnThis(),
  } as unknown as CoreService;
  let controller: CoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoreController],
      providers: [
        { provide: CoreService, useValue: mockHealthService },
        MockLoggerProvider,
      ],
    }).compile();

    controller = module.get(CoreController);
  });

  it(should.createInstance, () => {
    expect(controller).not.toBeNull();
    expect(controller).toBeInstanceOf(CoreController);
  });

  it(should.getHealth, () => {
    const mockHealth = new SystemHealth(3);
    let res: SystemHealth = null;

    mockHealthService.getHealth = jest.fn().mockReturnValue(mockHealth);

    expect(() => (res = controller.getHealth())).not.toThrow();
    expect(res).toBe(mockHealth);
  });

  it(should.getLogs, async () => {
    const filters: LogFiltersDto = {
      username: 'fake-username',
      password: 'fake-password',
      logFile: 'fake-log-file',
      skip: 0,
      limit: 50,
      context: 'fake-context',
    };
    const mockLogResponse = new LogResponse({
      logEntries: [],
      matchedEntries: 0,
    });

    mockHealthService.getLogFile = jest.fn().mockResolvedValue(mockLogResponse);

    await expect(controller.getLogs(filters)).resolves.toBe(mockLogResponse);
  });
});
