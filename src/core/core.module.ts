import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreController } from './controllers/core.controller';
import { AppConfigService } from './services';
import { CoreService } from './services/core/core.service';

@Module({
  imports: [ConfigModule],
  providers: [Logger, AppConfigService, CoreService],
  exports: [AppConfigService],
  controllers: [CoreController],
})
export class CoreModule {}
