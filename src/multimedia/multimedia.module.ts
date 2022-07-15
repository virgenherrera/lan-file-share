import { Module } from '@nestjs/common';
import { UploadController } from './controllers/upload.controller';
import { MulterConfigModule } from './modules';
import { UploadService } from './services';
import { MimeTypesController } from './controllers/mime-types.controller';

@Module({
  imports: [MulterConfigModule.registerAsync()],
  controllers: [UploadController, MimeTypesController],
  providers: [UploadService],
  exports: [UploadService],
})
export class MultimediaModule {}
