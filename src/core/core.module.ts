import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreController } from './controllers/core.controller';
import { AppConfigService, HealthService, LogFileService } from './services';

@Module({
  controllers: [CoreController],
  exports: [AppConfigService],
  imports: [ConfigModule],
  providers: [Logger, AppConfigService, HealthService, LogFileService],
})
export class CoreModule {}
