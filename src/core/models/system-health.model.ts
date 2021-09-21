import { ApiProperty } from '@nestjs/swagger';
import { formatDuration, subSeconds } from 'date-fns';
import { cpus, loadavg } from 'os';

export class SystemHealth {
  @ApiProperty() maxLoad: number;
  @ApiProperty() cpuLoad: number[];
  @ApiProperty() weightedLoad: number;
  @ApiProperty() healthy: boolean;
  @ApiProperty() uptime: number;
  @ApiProperty() humanUptime: string;
  @ApiProperty() uptimeSince: string;

  constructor(maxLoad: number) {
    this.maxLoad = maxLoad;
    this.cpuLoad = loadavg();
    this.weightedLoad = this.cpuLoad[0] / cpus().length;
    this.healthy = this.weightedLoad < this.maxLoad;
    this.uptime = process.uptime();
    this.humanUptime = formatDuration({ seconds: this.uptime });
    this.uptimeSince = subSeconds(new Date(), this.uptime).toISOString();
  }
}
