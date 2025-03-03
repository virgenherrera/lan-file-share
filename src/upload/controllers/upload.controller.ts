import { Body, Controller, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Logger } from '../../common/decorators';
import { PostUploadFileDocs, PostUploadManyFilesDocs } from '../docs';
import { UploadFileDto, UploadManyResponse, UploadResponse } from '../dto';
import { UploadService } from '../services';
import { IncomingFile } from '../types';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  @Logger() private readonly logger: Logger;

  constructor(private readonly uploadService: UploadService) {}

  @PostUploadFileDocs()
  async uploadFile(
    @UploadedFile() file: IncomingFile,
    @Body() { path, overwrite }: UploadFileDto,
  ): Promise<UploadResponse> {
    this.logger.log(`processing uploaded File`);

    return await this.uploadService.create(file, { path, overwrite });
  }

  @PostUploadManyFilesDocs()
  async uploadManyFiles(
    @UploadedFiles() files: IncomingFile[],
    @Body() { path, overwrite }: UploadFileDto,
  ): Promise<UploadManyResponse> {
    this.logger.log(`processing uploaded Files`);

    return await this.uploadService.batchCreate(files, { path, overwrite });
  }
}
