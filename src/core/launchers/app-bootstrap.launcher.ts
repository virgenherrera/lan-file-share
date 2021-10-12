import { AppConfigService } from '@core/services';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CreateWinstonLogger } from '@utils';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { AppModule } from '../../app.module';

export async function appBootstrap() {
  const globalPrefix = 'api/v1';
  const logCtx = `${globalPrefix}|bootstrap`;
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: CreateWinstonLogger(),
  });
  const { port, environment, openApi } = app.get(AppConfigService);
  const logger = app.get(Logger);

  app.setGlobalPrefix(globalPrefix);
  app.use(helmet());
  app.use(compression());

  if (openApi.buildFlag) {
    const { swaggerSetup } = await import('./swagger-setup.launcher');

    await swaggerSetup(app);
  }

  await app.listen(port);

  logger.log(`Server is listening on port: ${port}`, logCtx);
  logger.log(`Server is running in ${environment} environment`, logCtx);
}
