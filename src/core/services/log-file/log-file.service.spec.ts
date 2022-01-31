import { Test, TestingModule } from '@nestjs/testing';
import {
  MockAppConfigServiceProvider,
  MockLoggerProvider,
} from '../../../utils/testing';
import { LogFileService } from './log-file.service';

describe('UT:LogFileService', () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    getLogsBadAppCredentials = `Should get UnauthorizedException with bad AppCredentials.`,
    getLogsNoLogFile = `Should empty array for non existent logFile.`,
  }
  let service: LogFileService;

  beforeEach(async () => {
    // auto-mock fs
    jest.mock('fs');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogFileService,
        MockLoggerProvider,
        MockAppConfigServiceProvider,
      ],
    }).compile();

    service = module.get(LogFileService);
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(LogFileService);
  });
});
