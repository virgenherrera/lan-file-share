import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { format, formatDistanceToNowStrict, subSeconds } from 'date-fns';
import { createReadStream, readdir } from 'fs';
import { cpus as getCpuInfo } from 'os';
import { join } from 'path';
import { createInterface } from 'readline';
import {
  bindNodeCallback,
  filter,
  firstValueFrom,
  from,
  map,
  Observable,
  of,
  pluck,
  skip,
  Subject,
  switchMap,
  take,
  toArray,
} from 'rxjs';
import { promisify } from 'util';
import { AppConfigService } from '../';
import { LogFiltersDto } from '../../dtos';
import { LogEntry, LogResponse, SystemHealth } from '../../models';

@Injectable()
export class CoreService {
  private logsPath = join(process.cwd(), '/logs');

  constructor(
    private appConfigService: AppConfigService,
    private logger: Logger,
  ) {}

  async getHealth() {
    this.logger.log(`getHealth|getting service Health`, CoreService.name);

    const { uptime, uptimeSince } = this.getUptimes();
    const memoryUsage = this.getMemoryUsage();
    const cpuUsage = await this.getCpuUsage();

    return new SystemHealth({ cpuUsage, memoryUsage, uptime, uptimeSince });
  }

  async getLogFile(logFiltersDto: LogFiltersDto) {
    this.logger.log(`getLogFile|getting log file`, CoreService.name);

    this.validateAppCredentials(logFiltersDto.username, logFiltersDto.password);

    const logFile$ = this.observeLogFile(logFiltersDto);
    const logEntries = await firstValueFrom(logFile$);
    const matchedEntries = logEntries.length;

    return new LogResponse({ logEntries, matchedEntries });
  }

  validateAppCredentials(username: string, password: string) {
    this.logger.log(
      `validateAppCredentials|getting log file`,
      CoreService.name,
    );

    const APP_USER = this.appConfigService.get('APP_USER');
    const APP_PASS = this.appConfigService.get('APP_PASS');
    const usernameIsInvalid = APP_USER !== username;
    const passwordIsInvalid = APP_PASS !== password;
    const errorDetails = {
      code: 'bad-request-error',
      message: 'Bad Credentials',
      details: [],
    };

    if (usernameIsInvalid) {
      const msg = `'username' does not match APP_USER'`;

      this.logger.error(msg, CoreService.name);
      errorDetails.details.push(msg);
    }

    if (passwordIsInvalid) {
      const msg = `'password' does not match APP_PASS'`;

      this.logger.error(msg, CoreService.name);
      errorDetails.details.push(msg);
    }

    if (errorDetails.details.length) {
      throw new UnauthorizedException(errorDetails);
    }
  }

  private getUptimes() {
    const uptimeDate = subSeconds(new Date(), process.uptime());
    const uptime = formatDistanceToNowStrict(uptimeDate);
    const uptimeSince = format(uptimeDate, 'yyyy-MM-dd KK:mm:ss OOO');

    return { uptime, uptimeSince };
  }

  private getMemoryUsage() {
    const { heapUsed } = process.memoryUsage();
    const usedInKB = heapUsed / 1024;
    const usedInMB = usedInKB / 1024;
    const rounded = Math.round(usedInMB * 100) / 100;

    return `${rounded}MB`;
  }

  private async getCpuUsage() {
    const setTimeoutPromise = promisify(setTimeout);
    const { idle: startIdle, total: startTotal } = this.getCPUInfo();

    await setTimeoutPromise(500);

    const { idle: endIdle, total: endTotal } = this.getCPUInfo();
    const idle = endIdle - startIdle;
    const total = endTotal - startTotal;
    const percentage = idle / total;

    return `${percentage.toFixed(2)}%`;
  }

  private getCPUInfo() {
    const cpusInfo = getCpuInfo();
    let idle = 0;

    const total = cpusInfo.reduce((sum, cpuInfo) => {
      const cpuTimes = Object.values(cpuInfo.times);
      const cpuTimesSum = cpuTimes.reduce((sum, value) => sum + value, 0);

      idle += cpuInfo.times.idle;

      return sum + cpuTimesSum;
    }, 0);

    return { idle, total };
  }

  private observeLogFile(logFiltersDto: LogFiltersDto): Observable<LogEntry[]> {
    const regExp = new RegExp(`${logFiltersDto.logFile}.log$`);

    return this.observeLogsDirectory()
      .pipe(filter(filename => regExp.test(filename)))
      .pipe(
        switchMap(logFile =>
          !logFile
            ? of([])
            : this.observeLogFileFilters(logFile, logFiltersDto),
        ),
      );
  }

  private observeLogsDirectory() {
    const readDirObservable = bindNodeCallback(readdir);

    return readDirObservable(this.logsPath, {
      encoding: 'utf8',
      withFileTypes: true,
    }).pipe(
      switchMap(dirEntities => from(dirEntities)),
      pluck('name'),
      filter(filename => /\.log$/.test(filename)),
    );
  }

  private observeLogFileFilters(logFile: string, logFiltersDto: LogFiltersDto) {
    return this.getLogFileReader(logFile)
      .pipe(
        filter(
          logLine =>
            !logFiltersDto.context || logLine.includes(logFiltersDto?.context),
        ),
        filter(
          logLine =>
            !logFiltersDto.level || logLine.includes(logFiltersDto?.level),
        ),
        filter(
          logLine =>
            !logFiltersDto.message || logLine.includes(logFiltersDto?.message),
        ),
      )
      .pipe(skip(logFiltersDto.skip))
      .pipe(take(logFiltersDto.limit))
      .pipe(map(LogEntry.mapFromLogLine))
      .pipe(toArray());
  }

  private getLogFileReader(logFile: string) {
    const reader$ = new Subject<string>();
    const logFilePath = join(this.logsPath, logFile);
    const streamFileReader = createReadStream(logFilePath, {
      encoding: 'utf-8',
    });
    const readFileInterface = createInterface({
      input: streamFileReader,
      terminal: false,
    });

    readFileInterface.on('close', () => reader$.complete());
    readFileInterface.on('error', error => reader$.error(error));
    readFileInterface.on('line', line => reader$.next(line));

    return reader$;
  }
}
