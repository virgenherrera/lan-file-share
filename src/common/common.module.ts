import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonController } from './controllers/common.controller';
import { EnvConfigService, HealthService } from './services';

@Module({
  controllers: [CommonController],
  exports: [EnvConfigService],
  imports: [ConfigModule],
  providers: [EnvConfigService, HealthService],
})
export class CommonModule {}
