import { Module } from '@nestjs/common';
import { MulterConfigService } from './services/multer-config.service';

@Module({
  imports: [MulterConfigService.registerAsync()],
})
export class FileUploadModule {}
