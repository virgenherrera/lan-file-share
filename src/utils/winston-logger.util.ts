import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { join } from 'path';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { getPackageMetadata } from './get-package-metadata.util';

export function CreateWinstonLogger() {
  const { name } = getPackageMetadata();
  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          nestWinstonModuleUtilities.format.nestLike(name),
        ),
      }),
      createDailyRotateFile(name),
    ],
  });

  return logger;
}

function createDailyRotateFile(name: string) {
  const transport = new DailyRotateFile({
    filename: `${name}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '30m',
    maxFiles: '30d',
    dirname: join(process.cwd(), '/logs'),
  });

  return transport;
}
