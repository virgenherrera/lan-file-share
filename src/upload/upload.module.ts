import { Module } from '@nestjs/common';
import { FileSystemService } from '../multimedia/services';
import { UploadRepository } from './repositories';

@Module({
  providers: [FileSystemService, UploadRepository],
  exports: [UploadRepository],
})
export class UploadModule {}
