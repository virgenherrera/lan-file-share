import { Body, Controller, UploadedFile, UploadedFiles } from '@nestjs/common';

import { Logger } from '../../common/decorators';
import { DtoValidation } from '../../common/pipes';
import { PostUploadManyFilesDocs, PostUploadOneFileDocs } from '../docs';
import { UploadFileDto, UploadFilesDto } from '../dto';
import { UploadManyResponse, UploadResponse } from '../models';
import { UploadService } from '../services';

@Controller()
export class UploadController {
  @Logger() private logger: Logger;

  constructor(private uploadService: UploadService) {}

  @PostUploadOneFileDocs()
  async uploadOneFile(
    @Body(DtoValidation.pipe) { path, overwrite }: UploadFileDto,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<UploadResponse> {
    this.logger.log(`processing uploaded File`);

    return await this.uploadService.create(file, { path, overwrite });
  }

  @PostUploadManyFilesDocs()
  async uploadManyFiles(
    @Body(DtoValidation.pipe) { path, overwrite }: UploadFilesDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UploadManyResponse> {
    this.logger.log(`processing uploaded Files`);

    return await this.uploadService.batchCreate(files, { path, overwrite });
  }
}
