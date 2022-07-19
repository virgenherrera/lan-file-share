import { Module } from '@nestjs/common';
import { MimeTypesController } from './controllers/mime-types.controller';
import { UploadController } from './controllers/upload.controller';
import { MulterConfigModule } from './modules';
import { FileSystemService, UploadService } from './services';
import { FileController } from './controllers/file.controller';

@Module({
  imports: [MulterConfigModule.registerAsync()],
  controllers: [UploadController, MimeTypesController, FileController],
  providers: [UploadService, FileSystemService],
  exports: [UploadService, FileSystemService],
})
export class MultimediaModule {}
