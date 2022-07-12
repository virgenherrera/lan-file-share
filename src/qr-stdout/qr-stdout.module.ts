import { Module } from '@nestjs/common';
import { AfterApplicationBootstrapService } from './services/after-application-bootstrap.service';

@Module({
  providers: [AfterApplicationBootstrapService],
})
export class QrStdoutModule {}
