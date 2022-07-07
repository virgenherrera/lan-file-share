import { BadRequest } from '@core/exceptions';
import {
  Controller,
  HttpCode,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MultimediaRoute } from '../enums';
import { MediaInterceptor } from '../interceptors';
import { UploadService } from '../services';

@Controller()
export class UploadController {
  private logger = new Logger(this.constructor.name);

  constructor(private uploadService: UploadService) {}

  @Post(MultimediaRoute.upload)
  @HttpCode(204)
  @UseInterceptors(MediaInterceptor)
  async mediaUpload(@UploadedFile('file') file?: Express.Multer.File) {
    if (!file) throw new BadRequest(['No file uploaded.']);

    this.logger.log(`processing uploaded File`);

    return await this.uploadService.singleFile(file);
  }
}
