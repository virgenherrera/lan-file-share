import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { createReadStream, readdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class LogFileService {
  private logsPath = join(process.cwd(), '/logs');
  private logger = new Logger(this.constructor.name);

  async getStream(logFile: string) {
    this.logger.log(`getting log file`);

    this.validateLogFile(logFile);

    const logFileName = this.getLogFileName(logFile);
    const logFilePath = join(this.logsPath, logFileName);
    const streamFileReader = createReadStream(logFilePath, {
      encoding: 'utf-8',
    });

    return streamFileReader;
  }

  private validateLogFile(logFile: string): boolean {
    if (!logFile.match(/^\d{4}-\d{2}-\d{2}$/)) {
      throw new BadRequestException(
        `logFile param must Match 'YYYY-MM-DD' format`,
      );
    }

    return true;
  }

  private getLogFileName(logFile: string) {
    const regExp = new RegExp(`${logFile}.log$`);
    const defaultValue: string = null;
    const logFileName = readdirSync(this.logsPath, {
      encoding: 'utf8',
      withFileTypes: true,
    }).reduce((acc, dirEnt) => {
      if (acc) return acc;

      if (regExp.test(dirEnt.name)) {
        acc = dirEnt.name;
      }

      return acc;
    }, defaultValue);

    if (!logFileName) {
      throw new NotFoundException(`logFile: '${logFile}' does not exist.`);
    }

    return logFileName;
  }
}
