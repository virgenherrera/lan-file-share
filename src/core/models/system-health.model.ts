import { ApiProperty } from '@nestjs/swagger';
import { formatDuration, subSeconds } from 'date-fns';
import { cpus as getCpuInfo } from 'os';

export class SystemHealth {
  @ApiProperty() cpuUsage: string;
  @ApiProperty() humanUptime: string;
  @ApiProperty() memoryUsage: string;
  @ApiProperty() uptime: number;
  @ApiProperty() uptimeSince: string;

  constructor() {
    this.uptime = process.uptime();
    this.humanUptime = formatDuration({ seconds: this.uptime });
    this.uptimeSince = subSeconds(new Date(), this.uptime).toISOString();
    this.cpuUsage = `${this.getCpuUsage()}%`;
    this.memoryUsage = `${this.getUsedMemory()}MB`;
  }

  private getUsedMemory() {
    const { heapUsed } = process.memoryUsage();
    const usedInKB = heapUsed / 1024;
    const usedInMB = usedInKB / 1024;

    return Math.round(usedInMB * 100) / 100;
  }

  private getCpuUsage() {
    const { idle: startIdle, total: startTotal } = this.getCPUInfo();
    const { idle: endIdle, total: endTotal } = this.getCPUInfo();
    const idle = endIdle - startIdle;
    const total = endTotal - startTotal;
    const percentage = idle / total;
    let fixedPercentage: string;

    if (percentage) {
      fixedPercentage = percentage.toFixed(2);
    } else {
      fixedPercentage = this.getCpuUsage();
    }

    return fixedPercentage;
  }

  private getCPUInfo() {
    const cpusInfo = getCpuInfo();
    let idle = 0;

    const total = cpusInfo.reduce((sum, cpuInfo) => {
      const cpuTimes = Object.values(cpuInfo.times);
      const cpuTimesSum = cpuTimes.reduce((sum, entry) => sum + entry, 0);

      idle += cpuInfo.times.idle;

      return sum + cpuTimesSum;
    }, 0);

    return { idle, total };
  }
}
