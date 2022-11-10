import { Logger, NestApplicationOptions, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { EnvConfigService } from '../services';

export class AppBuilder {
  static async bootstrap(buildDocs = false) {
    const instance = new AppBuilder();

    await instance.bootstrap(buildDocs);

    return instance.app;
  }

  private app: NestExpressApplication;
  private buildDocs: boolean;
  private logger = new Logger(this.constructor.name);
  private options: NestApplicationOptions = { logger: [] };
  private prefix = 'api';

  async bootstrap(buildDocs: boolean) {
    this.buildDocs = buildDocs;

    await this.setLogger();
    await this.initApp();
    await this.setGlobalPrefix();
    await this.setVersioning();
    await this.setAppMiddleware();
    await this.setAppPort();
  }

  private async setLogger() {
    if (this.buildDocs) return;

    const { CreateWinstonLogger } = await import('../../utils');

    const logger = CreateWinstonLogger();

    this.options = { logger };
  }

  private async initApp() {
    const { AppModule } = await import('../../app.module');

    this.app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      this.options,
    );
  }

  private async setGlobalPrefix() {
    this.logger.log(`setting app prefix: ${this.prefix}`);
    this.app.setGlobalPrefix(this.prefix);
  }

  private async setVersioning() {
    this.logger.log(`setting app URI version to 1`);
    this.app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
  }

  private async setAppMiddleware() {
    if (this.buildDocs) return;

    const { default: helmet } = await import('helmet');
    const compression = await import('compression');

    this.app.use(helmet());
    this.app.use(compression());
  }

  private async setAppPort() {
    if (this.buildDocs) return;

    const { port, environment } = this.app.get(EnvConfigService);

    await this.app.listen(port);

    this.logger.log(`Server is listening on port: ${port}`);
    this.logger.log(
      `Server is running in "${environment}" environment`,
      AppBuilder.name,
    );
  }
}
