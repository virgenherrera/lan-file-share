import { ApiProperty } from '@nestjs/swagger';

export class SystemHealth {
  @ApiProperty() cpuUsage: string;
  @ApiProperty() memoryUsage: string;
  @ApiProperty() uptime: string;
  @ApiProperty() uptimeSince: string;

  constructor({ cpuUsage, memoryUsage, uptime, uptimeSince }: SystemHealth) {
    Object.assign(this, { cpuUsage, memoryUsage, uptime, uptimeSince });
  }
}
