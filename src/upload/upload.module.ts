import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { UploadController } from './controllers';
import { MulterConfig } from './imports';
import { UploadRepository } from './repositories';
import { FileSystemService, MimeTypesService } from './services';

@Module({
  imports: [CommonModule, MulterConfig.registerAsync()],
  controllers: [UploadController],
  providers: [
    MulterConfig,
    FileSystemService,
    UploadRepository,
    MimeTypesService,
  ],
  exports: [FileSystemService, UploadRepository, MimeTypesService],
})
export class UploadModule {}
