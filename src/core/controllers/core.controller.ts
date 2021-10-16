import { Controller, Get, Logger, Query } from '@nestjs/common';
import { GetHealthDocs } from '../api-docs/get-health.docs';
import { GetLogsDocs } from '../api-docs/get-logs.docs';
import { LogFiltersDto } from '../dtos';
import { AppRoute } from '../enums';
import { DtoValidationPipe } from '../pipes';
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

  @Get(AppRoute.coreLogs)
  @GetLogsDocs()
  async getLogs(
    @Query(DtoValidationPipe.pipe)
    logFiltersDto: LogFiltersDto,
  ) {
    this.logger.log(`getLogs|GET ${AppRoute.coreLogs}`, CoreController.name);

    return await this.logFileService.getLogFile(logFiltersDto);
  }
}
