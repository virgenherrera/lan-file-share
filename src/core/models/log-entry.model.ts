import { LogLevel } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class LogEntry {
  static mapFromLogLine(logLine: string) {
    return new LogEntry(JSON.parse(logLine));
  }

  @ApiProperty() stack?: string[];
  @ApiProperty() context?: string;
  @ApiProperty() level: LogLevel;
  @ApiProperty() message: string;

  constructor(logRecord: Partial<LogEntry>) {
    Object.assign(this, logRecord);
  }
}
