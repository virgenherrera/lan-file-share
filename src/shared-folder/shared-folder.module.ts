import { Module } from '@nestjs/common';

import { CommonModule } from '../common/common.module';
import { MulterConfig } from '../upload/imports';
import { SharedFolderController } from './controllers';
import {
  FolderInfoService,
  StreamableFileService,
  StreamableZipFileService,
} from './services';

@Module({
  imports: [CommonModule],
  controllers: [SharedFolderController],
  providers: [
    MulterConfig,
    FolderInfoService,
    StreamableFileService,
    StreamableZipFileService,
  ],
  exports: [FolderInfoService, StreamableFileService, StreamableZipFileService],
})
export class SharedFolderModule {}
