import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { UploadController } from './controllers';
import { MulterConfig } from './imports';
import { UploadRepository } from './repositories';
import { FileSystemService } from './services';

@Module({
  imports: [CommonModule, MulterConfig.registerAsync()],
  controllers: [UploadController],
  providers: [MulterConfig, FileSystemService, UploadRepository],
  exports: [FileSystemService, UploadRepository],
})
export class UploadModule {}
