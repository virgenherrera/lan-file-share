import { ApiProperty } from '@nestjs/swagger';
import { LogEntry } from './log-entry.model';

export class LogResponse {
  @ApiProperty() logEntries: LogEntry[];
  @ApiProperty() matchedEntries: number;

  constructor(logResponse: Partial<LogResponse>) {
    Object.assign(this, logResponse);
  }
}
