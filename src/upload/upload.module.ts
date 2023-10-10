import { Module } from '@nestjs/common';

import { CommonModule } from '../common/common.module';
import { UploadController } from './controllers';
import { MulterConfig } from './imports';
import { UploadRepository } from './repositories';

@Module({
  imports: [CommonModule, MulterConfig.registerAsync()],
  controllers: [UploadController],
  providers: [MulterConfig, UploadRepository],
  exports: [UploadRepository],
})
export class UploadModule {}
