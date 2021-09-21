import { AppConfigService } from '@core/services';
import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

export async function swaggerSetup(app: INestApplication) {
  const logCtx = 'swaggerSetup';
  const rootPath = resolve(process.cwd());
  const path = join(rootPath, './package.json');
  const packageJson = JSON.parse(
    readFileSync(path, {
      encoding: 'utf8',
      flag: 'r',
    }),
  );
  const { openApi } = app.get(AppConfigService);
  const logger = app.get(Logger);

  const swaggerConfig = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setVersion(packageJson.version)
    .setDescription(packageJson.description)
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  if (openApi.attachFlag) {
    logger.log(`Attaching OpenAPI in path: ${openApi.path}`, logCtx);
    SwaggerModule.setup(openApi.path, app, swaggerDocument, {
      explorer: true,
    });
  } else {
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    const outputPath = join(rootPath, 'dist', openApi.path);
    const filePath = join(outputPath, 'swagger.json');
    const fileContent = JSON.stringify(document, null, 2);

    if (!existsSync(outputPath)) {
      mkdirSync(outputPath, { recursive: true, mode: '0777' });
    }

    logger.log(`Writing OpenAPI file in path: ${filePath}`, logCtx);
    writeFileSync(filePath, fileContent, { encoding: 'utf8' });
  }
}
