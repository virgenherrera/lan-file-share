import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    CoreModule,
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
