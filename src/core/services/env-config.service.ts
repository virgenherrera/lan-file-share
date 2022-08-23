import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from '../enums/environment.enum';

@Injectable()
export class EnvConfigService {
  get = this.configService.get.bind(this.configService);
  environment: Environment;
  port = 3000;

  constructor(private configService: ConfigService) {
    this.ensureEnvironment();
    this.ensurePort();

    Object.freeze(this);
    Object.seal(this);
  }

  private ensureEnvironment() {
    const NODE_ENV = this.configService.get<Environment>('NODE_ENV');
    const valueKey = NODE_ENV || Environment.development;

    this.environment = Environment[valueKey];
  }

  private ensurePort() {
    const APP_PORT = this.configService.get<string>('APP_PORT');

    if (APP_PORT) {
      this.port = Number(APP_PORT);
    }
  }

  get openApiPath() {
    const defaultValue = 'dist/openApi-docs/';
    const value = this.configService.get<string>('APP_OPEN_API_PATH');

    return !value ? defaultValue : value;
  }
}
