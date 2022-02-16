import { Controller, Get, Logger, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GetHealthDocs } from '../docs/get-health.docs';
import { GetLogsDocs } from '../docs/get-logs.docs';
import { CoreRoute } from '../enums';
import { AppAuthGuard } from '../guards';
import { SystemHealth } from '../models';
import { HealthService, LogFileService } from '../services';

@Controller()
export class CoreController {
  private logger = new Logger(this.constructor.name);

  constructor(
    private healthService: HealthService,
    private logFileService: LogFileService,
  ) {}

  @Get(CoreRoute.health)
  @GetHealthDocs()
  async getHealth(): Promise<SystemHealth> {
    this.logger.log(`Getting service Health.`);

    return await this.healthService.getHealth();
  }

  @Get(CoreRoute.logs)
  @UseGuards(AppAuthGuard)
  @UseGuards(AppAuthGuard)
  @GetLogsDocs()
  async getLogFile(@Param('logFile') logFile: string, @Res() res: Response) {
    this.logger.log(`Fetching logFile: ${logFile}.`);

    const fileStream = await this.logFileService.getStream(logFile);

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename=${logFile}.log`);

    return fileStream.pipe(res);
  }
}
