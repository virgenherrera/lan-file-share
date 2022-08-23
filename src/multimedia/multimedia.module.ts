import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { FileController } from './controllers/file.controller';
import { MimeTypesController } from './controllers/mime-types.controller';
import { UploadController } from './controllers/upload.controller';
import { MulterConfig } from './modules';
import {
  FileSystemService,
  SharedFolderService,
  UploadService,
} from './services';

@Module({
  imports: [CoreModule, MulterConfig.registerAsync()],
  controllers: [UploadController, MimeTypesController, FileController],
  providers: [
    MulterConfig,
    FileSystemService,
    UploadService,
    SharedFolderService,
  ],
  exports: [UploadService, SharedFolderService],
})
export class MultimediaModule {}
