import { Module } from '@nestjs/common';
import { EnvConfigService } from '../core/services';
import { AfterApplicationBootstrapService } from './services/after-application-bootstrap.service';

@Module({
  providers: [EnvConfigService, AfterApplicationBootstrapService],
})
export class QrStdoutModule {}
