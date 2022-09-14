import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CoreModule } from './core/core.module';
import { LogRequestMiddleware } from './core/middleware';
import { MultimediaModule } from './multimedia/multimedia.module';
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
      rootPath: join(__dirname, '..', 'public'),
      serveStaticOptions: {
        setHeaders(res) {
          res.setHeader(
            'Content-Security-Policy',
            `default-src *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src	'self' 'unsafe-inline' *; img-src 'self' data: *`,
          );
        },
      },
    }),
    CoreModule,
    MultimediaModule,
    UploadModule,
    SharedFolderModule,
    QrStdoutModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogRequestMiddleware).forRoutes('*');
  }
}
