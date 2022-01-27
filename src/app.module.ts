import { CoreModule } from '@core/core.module';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    CoreModule,
  ],
  providers: [Logger],
})
export class AppModule {}
