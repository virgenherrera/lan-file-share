import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './controllers/health.controller';
import { AppConfigService, HealthService } from './services';

@Module({
  imports: [ConfigModule],
  providers: [Logger, AppConfigService, HealthService],
  exports: [AppConfigService],
  controllers: [HealthController],
})
export class CoreModule {}
