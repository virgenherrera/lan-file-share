import { Module } from '@nestjs/common';
import { EnvConfigService } from '../common/services';
import { QrStdoutService } from './services/qr-stdout.service';

@Module({
  providers: [EnvConfigService, QrStdoutService],
})
export class QrStdoutModule {}
