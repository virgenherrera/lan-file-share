import { Injectable, Logger } from '@nestjs/common';
import { format, formatDistanceToNowStrict, subSeconds } from 'date-fns';
import { cpus as getCpuInfo } from 'os';
import { promisify } from 'util';
import { SystemHealth } from '../models';

@Injectable()
export class HealthService {
  private logger = new Logger(this.constructor.name);

  async getHealth() {
    this.logger.log(`getting service Health`);

    const { uptime, uptimeSince } = this.getUptimes();
    const memoryUsage = this.getMemoryUsage();
    const cpuUsage = await this.getCpuUsage();

    return new SystemHealth({ cpuUsage, memoryUsage, uptime, uptimeSince });
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
}
