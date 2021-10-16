import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { createReadStream, readdir } from 'fs';
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
import { LogFiltersDto } from '../../dtos';
import { LogEntry, LogResponse } from '../../models';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable()
export class LogFileService {
  private logsPath = join(process.cwd(), '/logs');

  constructor(
    private appConfigService: AppConfigService,
    private logger: Logger,
  ) {}

  async getLogFile(logFiltersDto: LogFiltersDto) {
    this.logger.log(`getLogFile|getting log file`, LogFileService.name);

    this.validateAppCredentials(logFiltersDto);

    const logFile$ = this.observeLogFile(logFiltersDto);
    const logEntries = await firstValueFrom(logFile$);
    const matchedEntries = logEntries.length;

    return new LogResponse({ logEntries, matchedEntries });
  }

  private validateAppCredentials({ username, password }: LogFiltersDto) {
    this.logger.log(
      `validateAppCredentials|getting log file`,
      LogFileService.name,
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

      this.logger.error(msg, LogFileService.name);
      errorDetails.details.push(msg);
    }

    if (passwordIsInvalid) {
      const msg = `'password' does not match APP_PASS'`;

      this.logger.error(msg, LogFileService.name);
      errorDetails.details.push(msg);
    }

    if (errorDetails.details.length) {
      throw new UnauthorizedException(errorDetails);
    }
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
