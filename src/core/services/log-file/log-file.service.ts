import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { createReadStream, readdirSync } from 'fs';
import { join } from 'path';
import { LogFileDto } from '../../dtos';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable()
export class LogFileService {
  private logsPath = join(process.cwd(), '/logs');

  constructor(
    private appConfigService: AppConfigService,
    private logger: Logger,
  ) {}

  async getStream(logFileDto: LogFileDto) {
    this.logger.log(`getStreamFile|getting log file`, LogFileService.name);

    this.validateAppCredentials(logFileDto);

    const logFile = this.findLogFile(logFileDto.logFile);
    const logFilePath = join(this.logsPath, logFile);
    const streamFileReader = createReadStream(logFilePath, {
      encoding: 'utf-8',
    });

    return streamFileReader;
  }

  private validateAppCredentials({ username, password }: LogFileDto) {
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

  private findLogFile(logFile: string) {
    const regExp = new RegExp(`${logFile}.log$`);
    const defaultValue: string = null;

    const res = readdirSync(this.logsPath, {
      encoding: 'utf8',
      withFileTypes: true,
    }).reduce((acc, dirEnt) => {
      if (regExp.test(dirEnt.name)) {
        acc = dirEnt.name;
      }

      return acc;
    }, defaultValue);

    if (!res) {
      throw new NotFoundException(`logFile: '${logFile}' not found.`);
    }

    return res;
  }
}
