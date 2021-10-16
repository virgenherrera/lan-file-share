import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockAppConfigService,
  MockAppConfigServiceProvider,
  MockLoggerProvider,
} from '../../../utils/testing';
import { LogFiltersDto } from '../../dtos';
import { LogFileService } from './log-file.service';

describe('UT:LogFileService', () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    getLogsBadAppCredentials = `Should get UnauthorizedException with bad AppCredentials.`,
    getLogsNoLogFile = `Should empty array for non existent logFile.`,
  }
  // const fsMockModule: any = jest.createMockFromModule('fs');
  // const mockDirEnt = [
  //   { name: 'foo-bar-2021-01-01' },
  //   { name: 'foo-bar-2021-01-02' },
  // ];
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

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(LogFileService);
  });

  it(should.getLogsBadAppCredentials, async () => {
    const mockEnv = {
      APP_USER: 'fake-app-user',
      APP_PASS: 'fake-app-password',
    };
    const filters: LogFiltersDto = {
      username: 'fake-username',
      password: 'fake-password',
      logFile: '2021-01-01',
      level: 'error',
      skip: 0,
      limit: 5,
    };

    mockAppConfigService.get = jest
      .fn()
      .mockImplementation((key: keyof typeof mockEnv) => mockEnv[key]);

    await expect(service.getLogFile(filters)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  // it(should.getLogsNoLogFile, async () => {
  //   const mockEnv = {
  //     APP_USER: 'fake-app-user',
  //     APP_PASS: 'fake-app-password',
  //   };
  //   const filters: LogFiltersDto = {
  //     username: mockEnv.APP_USER,
  //     password: mockEnv.APP_PASS,
  //     logFile: '2021-01-03',
  //     level: 'error',
  //     skip: 0,
  //     limit: 5,
  //   };

  //   mockAppConfigService.get = jest
  //     .fn()
  //     .mockImplementation((key: keyof typeof mockEnv) => mockEnv[key]);

  //   fsMockModule.readdir = jest
  //     .fn()
  //     .mockImplementation(
  //       (_path: string, _options: any, callback: CallableFunction) =>
  //         callback(null, mockDirEnt),
  //     );

  //   await expect(service.getLogFile(filters)).resolves.toEqual([]);
  // });
});

// it(should.validateAppCredentials, () => {
//   const mockEnv = {
//     APP_USER: 'fake-user',
//     APP_PASS: 'fake-password',
//   };

//   mockAppConfigService.get = jest
//     .fn()
//     .mockImplementation((key: keyof typeof mockEnv) => mockEnv[key]);

//   expect(() =>
//     service.validateAppCredentials('fake-user', 'fake-password'),
//   ).not.toThrow();
// });

// it(should.validateBadAppCredentials, () => {

// });
