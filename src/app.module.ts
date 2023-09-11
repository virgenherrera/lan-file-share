import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { publicHtmlPath } from 'lan-file-share-ui';
import { join, resolve } from 'path';

import { ChatModule } from './chat/chat.module';
import { CommonModule } from './common/common.module';
import { LogRequestMiddleware } from './common/middleware';
import { SharedFolderModule } from './shared-folder/shared-folder.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: resolve(join(__dirname, '../.env')),
    }),
    ServeStaticModule.forRoot({
      rootPath: publicHtmlPath,
      serveStaticOptions: {
        setHeaders(res) {
          res.setHeader(
            'Content-Security-Policy',
            `default-src *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src	'self' 'unsafe-inline' *; img-src 'self' data: *`,
          );
        },
      },
    }),
    CommonModule,
    UploadModule,
    SharedFolderModule,
    ChatModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogRequestMiddleware).forRoutes('*');
  }
}
