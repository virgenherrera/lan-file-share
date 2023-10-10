import { Body, Controller, UploadedFile, UploadedFiles } from '@nestjs/common';
import { Logger } from '../../common/decorators';
import { DtoValidation } from '../../common/pipes';
import { PostUploadManyFilesDocs, PostUploadOneFileDocs } from '../docs';
import { UploadFileDto, UploadFilesDto } from '../dto';
import { MulterFile } from '../interfaces';
import { UploadManyResponse, UploadResponse } from '../models';
import { UploadRepository } from '../repositories';

@Controller()
export class UploadController {
  @Logger() private logger: Logger;

  constructor(private uploadRepository: UploadRepository) {}

  @PostUploadOneFileDocs()
  async uploadOneFile(
    @Body(DtoValidation.pipe) { path, overwrite }: UploadFileDto,
    @UploadedFile('file') file: MulterFile,
  ): Promise<UploadResponse> {
    this.logger.log(`processing uploaded File`);

    return await this.uploadRepository.create(file, { path, overwrite });
  }

  @PostUploadManyFilesDocs()
  async uploadManyFiles(
    @Body(DtoValidation.pipe) { path, overwrite }: UploadFilesDto,
    @UploadedFiles() files: MulterFile[],
  ): Promise<UploadManyResponse> {
    this.logger.log(`processing uploaded Files`);

    return await this.uploadRepository.batchCreate(files, { path, overwrite });
  }
}
