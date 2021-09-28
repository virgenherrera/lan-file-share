import { Controller, Get, Logger, Query } from '@nestjs/common';
import { GetHealthDocs } from '../api-docs/get-health.docs';
import { GetLogsDocs } from '../api-docs/get-logs.docs';
import { LogFiltersDto } from '../dtos';
import { AppRoute } from '../enums';
import { DtoValidationPipe } from '../pipes';
import { CoreService } from '../services';

@Controller()
export class CoreController {
  constructor(private coreService: CoreService, private logger: Logger) {}

  @Get(AppRoute.coreHealth)
  @GetHealthDocs()
  getHealth() {
    this.logger.log(
      `getHealth|GET ${AppRoute.coreHealth}`,
      CoreController.name,
    );

    return this.coreService.getHealth();
  }

  @Get(AppRoute.coreLogs)
  @GetLogsDocs()
  async getLogs(
    @Query(DtoValidationPipe.build)
    logFiltersDto: LogFiltersDto,
  ) {
    this.logger.log(`getLogs|GET ${AppRoute.coreLogs}`, CoreController.name);

    return await this.coreService.getLogFile(logFiltersDto);
  }
}
