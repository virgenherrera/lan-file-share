import {
  Body,
  Controller,
  Get,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Logger } from '../../common/decorators';
import { BadRequest } from '../../common/exceptions';
import { DtoValidation } from '../../common/pipes';
import { PostUploadManyFilesDocs, PostUploadOneFileDocs } from '../docs';
import { UploadFileDto, UploadFilesDto } from '../dto';
import { UploadRoute } from '../enums';
import { FileWithDestinationPath, MulterFile } from '../interfaces';
import { UploadManyResponse, UploadResponse } from '../models';
import { MimeTypesResponse } from '../models/mime-types-response.model';
import { UploadRepository } from '../repositories';
import { MimeTypesService } from '../services';

@Controller()
export class UploadController {
  @Logger() private logger: Logger;

  constructor(
    private mimeTypesService: MimeTypesService,
    private uploadRepository: UploadRepository,
  ) {}

  @Get(UploadRoute.mimeTypes)
  @ApiOperation({
    summary: `GET ${UploadRoute.mimeTypes}`,
    description: 'an endpoint to get a list of Allowed MIME types to upload.',
  })
  @ApiOkResponse({
    isArray: true,
    type: MimeTypesResponse,
    description:
      'an Object containing lists of all file types allowed for sharing.',
  })
  async getMimeTypes(): Promise<MimeTypesResponse> {
    return this.mimeTypesService.mimeTypesResponse;
  }

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
