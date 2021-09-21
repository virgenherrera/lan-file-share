import { Injectable, Logger } from '@nestjs/common';
import { SystemHealth } from '../../models';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable()
export class HealthService {
  constructor(
    private appConfigService: AppConfigService,
    private logger: Logger,
  ) {}

  getHealth() {
    this.logger.log(`getHealth|getting service Health`, HealthService.name);

    const APP_MAX_LOAD = this.appConfigService.get('APP_MAX_LOAD');
    const maxLoad = parseInt(APP_MAX_LOAD);

    return new SystemHealth(maxLoad);
  }
}
