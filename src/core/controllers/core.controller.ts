import { Body, Controller, Get, Logger, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetHealthDocs } from '../docs/get-health.docs';
import { PostLogsDocs } from '../docs/post-logs.docs';
import { LogFileDto } from '../dtos';
import { AppRoute } from '../enums';
import { DtoValidation } from '../pipes';
import { HealthService, LogFileService } from '../services';

@Controller()
export class CoreController {
  constructor(
    private healthService: HealthService,
    private logFileService: LogFileService,
    private logger: Logger,
  ) {}

  @Get(AppRoute.coreHealth)
  @GetHealthDocs()
  async getHealth() {
    this.logger.log(
      `getHealth|GET ${AppRoute.coreHealth}`,
      CoreController.name,
    );

    return await this.healthService.getHealth();
  }

  @Post(AppRoute.coreLogs)
  @PostLogsDocs()
  async postLogs(
    @Body(DtoValidation.pipe) logFileDto: LogFileDto,
    @Res() res: Response,
  ) {
    this.logger.log(`getLogs|POST ${AppRoute.coreLogs}`, CoreController.name);

    const fileStream = await this.logFileService.getStream(logFileDto);

    res.status(200);
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${logFileDto.logFile}.log`,
    );

    return fileStream.pipe(res);
  }
}
