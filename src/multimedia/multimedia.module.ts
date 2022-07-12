import { Module } from '@nestjs/common';
import { UploadController } from './controllers/upload.controller';
import { MulterConfigModule } from './modules';
import { UploadService } from './services';

@Module({
  imports: [MulterConfigModule.registerAsync()],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class MultimediaModule {}
