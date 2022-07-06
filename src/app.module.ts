import { CoreModule } from '@core/core.module';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LogRequestMiddleware } from './core/middleware';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    CoreModule,
    FileUploadModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogRequestMiddleware).forRoutes('*');
  }
}
