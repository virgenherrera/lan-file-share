import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { publicHtmlPath } from 'lan-file-share-ui';
import { CommonModule } from './common/common.module';
import { LogRequestMiddleware } from './common/middleware';
import { QrStdoutModule } from './qr-stdout/qr-stdout.module';
import { SharedFolderModule } from './shared-folder/shared-folder.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
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
    QrStdoutModule,
    CommonModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogRequestMiddleware).forRoutes('*');
  }
}
