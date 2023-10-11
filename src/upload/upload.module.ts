import { Module } from '@nestjs/common';

import { CommonModule } from '../common/common.module';
import { UploadController } from './controllers';
import { MulterConfig } from './imports';
import { UploadService } from './services';

@Module({
  imports: [CommonModule, MulterConfig.registerAsync()],
  controllers: [UploadController],
  providers: [MulterConfig, UploadService],
  exports: [UploadService],
})
export class UploadModule {}
