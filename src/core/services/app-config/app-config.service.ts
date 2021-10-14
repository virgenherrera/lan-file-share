import { Injectable } from '@nestjs/common';
import { ConfigService, NoInferType } from '@nestjs/config';
import { Environment } from '../../enums/environment.enum';

@Injectable()
export class AppConfigService {
  environment: Environment;
  constructor(private configService: ConfigService) {
    this.ensureEnvironment();
  }

  private ensureEnvironment() {
    const NODE_ENV = this.configService.get<Environment>('NODE_ENV');
    const valueKey = NODE_ENV || Environment.development;

    this.environment = Environment[valueKey];
  }

  get port() {
    const APP_PORT = this.get<string>('APP_PORT', '0');

    return Number(APP_PORT);
  }

  get openApi() {
    const APP_OPEN_API = this.get<string>('APP_OPEN_API');
    const APP_OPEN_API_ATTACH = this.get<string>('APP_OPEN_API_ATTACH');
    const buildFlag = this.valueIsTrue(APP_OPEN_API);
    const attachFlag = this.valueIsTrue(APP_OPEN_API_ATTACH);
    const path = this.get<string>('APP_OPEN_API_PATH', 'docs/');

    return { buildFlag, attachFlag, path };
  }

  get<T = any>(propertyPath: string, defaultValue?: NoInferType<T>) {
    return this.configService.get<T>(propertyPath, defaultValue);
  }

  private valueIsTrue(value: string) {
    return ['true', '1', 'yes'].includes(value);
  }
}
