import { Module } from '@nestjs/common';
import { EnvironmentService } from '../common/services';
import { QrStdoutService } from './services/qr-stdout.service';

@Module({
  providers: [EnvironmentService, QrStdoutService],
})
export class QrStdoutModule {}
