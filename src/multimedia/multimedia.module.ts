import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import {
  FileController,
  MimeTypesController,
  UploadController,
} from './controllers';
import { MulterConfig } from './modules';
import { UploadRepository } from './repositories';
import { FileSystemService, SharedFolderService } from './services';

@Module({
  imports: [CoreModule, MulterConfig.registerAsync()],
  controllers: [UploadController, MimeTypesController, FileController],
  providers: [
    MulterConfig,
    FileSystemService,
    UploadRepository,
    SharedFolderService,
  ],
  exports: [UploadRepository, SharedFolderService],
})
export class MultimediaModule {}
