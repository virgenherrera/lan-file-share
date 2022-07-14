import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { LogRequestMiddleware } from './core/middleware';
import { MultimediaModule } from './multimedia/multimedia.module';
import { QrStdoutModule } from './qr-stdout/qr-stdout.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    CoreModule,
    MultimediaModule,
    QrStdoutModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogRequestMiddleware).forRoutes('*');
  }
}
