import { BadRequest } from '@core/exceptions';
import {
  Controller,
  HttpCode,
  Logger,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MediaMimeTypes } from '../constants';
import { uploadManyDocs, UploadOneDocs } from '../docs';
import { MultimediaRoute } from '../enums';
import {
  UploadedFileInterceptor,
  UploadedFilesInterceptor,
} from '../interceptors';
import { UploadManyResponse } from '../models';
import { UploadService } from '../services';

@Controller()
export class UploadController {
  private logger = new Logger(this.constructor.name);

  constructor(private uploadService: UploadService) {}

  @Post(MultimediaRoute.file)
  @UploadOneDocs()
  @HttpCode(204)
  @UseInterceptors(UploadedFileInterceptor(MediaMimeTypes))
  async uploadOne(@UploadedFile('file') file?: Express.Multer.File) {
    if (!file) throw new BadRequest(['No file uploaded.']);

    this.logger.log(`processing uploaded File`);

    return await this.uploadService.singleFile(file);
  }

  @Post(MultimediaRoute.files)
  @uploadManyDocs()
  @UseInterceptors(UploadedFilesInterceptor(MediaMimeTypes))
  async uploadMany(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UploadManyResponse> {
    if (!files.length) throw new BadRequest(['No files uploaded.']);

    this.logger.log(`processing uploaded Files`);

    return await this.uploadService.multipleFiles(files);
  }
}
