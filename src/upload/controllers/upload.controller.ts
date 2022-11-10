import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { BadRequest } from '../../common/exceptions';
import { DtoValidation } from '../../common/pipes';
import { MediaMimeTypes } from '../constants';
import { PostUploadManyFilesDocs, PostUploadOneFileDocs } from '../docs';
import { UploadFileDto, UploadFilesDto } from '../dto';
import { UploadRoute } from '../enums';
import { FileWithDestinationPath, MulterFile } from '../interfaces';
import { UploadManyResponse, UploadResponse } from '../models';
import { UploadRepository } from '../repositories';

@Controller()
export class UploadController {
  private logger = new Logger(this.constructor.name);

  constructor(private uploadRepository: UploadRepository) {}

  @Get(UploadRoute.mimeTypes)
  async getMimeTypes() {
    return { data: MediaMimeTypes };
  }

  @Post(UploadRoute.file)
  @PostUploadOneFileDocs()
  async uploadOneFile(
    @Body(DtoValidation.pipe) body: UploadFileDto,
    @UploadedFile('file') file?: MulterFile,
  ): Promise<UploadResponse> {
    if (!file) throw new BadRequest('No file uploaded.');

    this.logger.log(`processing uploaded File`);
    const fileWithDestinationPath: FileWithDestinationPath = {
      ...file,
      destinationPath: body.path,
    };

    return await this.uploadRepository.create(fileWithDestinationPath);
  }

  @Post(UploadRoute.files)
  @PostUploadManyFilesDocs()
  async uploadManyFiles(
    @Body(DtoValidation.pipe) body: UploadFilesDto,
    @UploadedFiles() files: MulterFile[],
  ): Promise<UploadManyResponse> {
    if (!files?.length) throw new BadRequest('No files uploaded.');

    this.logger.log(`processing uploaded Files`);

    const filesWithDestinationPath: FileWithDestinationPath[] = files.map(
      file => ({ ...file, destinationPath: body.path }),
    );

    return await this.uploadRepository.batchCreate(filesWithDestinationPath);
  }
}
