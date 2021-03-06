import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from '../../app.module';
import { CreateWinstonLogger } from '../../utils';
import { EnvConfigService } from '../services';

export class AppBuilder {
  static async bootstrap(buildDocs = false) {
    const instance = new AppBuilder();

    await instance.bootstrap(buildDocs);

    return instance.app;
  }

  private app: NestExpressApplication;
  private prefix = 'api/v1';
  private logger = new Logger(this.constructor.name);

  async bootstrap(buildDocs: boolean) {
    this.app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: !buildDocs ? CreateWinstonLogger() : undefined,
    });

    this.logger.log(`setting app prefix: ${this.prefix}`, AppBuilder.name);
    this.app.setGlobalPrefix(this.prefix);

    if (!buildDocs) this.setExecutionContext();
  }

  private async setExecutionContext() {
    const { port, environment } = this.app.get(EnvConfigService);

    this.app.use(helmet());
    this.app.use(compression());

    await this.app.listen(port);

    this.logger.log(`Server is listening on port: ${port}`, AppBuilder.name);
    this.logger.log(
      `Server is running in ${environment} environment`,
      AppBuilder.name,
    );
  }
}
