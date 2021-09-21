import { Controller, Get, Logger } from '@nestjs/common';
import { GetHealthDocs } from '../api-docs/get-health.docs';
import { AppRoute } from '../enums';
import { HealthService } from '../services';

@Controller()
export class HealthController {
  constructor(private healthService: HealthService, private logger: Logger) {}

  @Get(AppRoute.health)
  @GetHealthDocs()
  getHealth() {
    this.logger.log(`getHealth|GET ${AppRoute.health}`, HealthController.name);

    return this.healthService.getHealth();
  }
}
