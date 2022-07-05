import { Controller, Get, Logger } from '@nestjs/common';
import { GetHealthDocs } from '../docs/get-health.docs';
import { CoreRoute } from '../enums';
import { SystemHealth } from '../models';
import { HealthService } from '../services';

@Controller()
export class CoreController {
  private logger = new Logger(this.constructor.name);

  constructor(private healthService: HealthService) {}

  @Get(CoreRoute.health)
  @GetHealthDocs()
  async getHealth(): Promise<SystemHealth> {
    this.logger.log(`Getting service Health.`);

    return await this.healthService.getHealth();
  }
}
