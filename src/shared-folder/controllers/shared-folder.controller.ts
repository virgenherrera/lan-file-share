import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Query,
  Response as ResponseDecorator,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { DtoValidation } from '../../core/pipes';
import { GetFileDocs, GetSharedFolderDocs, GetZipFileDocs } from '../docs';
import { PathParamDto, ZipFilesDto } from '../dto';
import { SharedFolderRoute } from '../enums';
import { FolderInfo } from '../models';

@Controller()
export class SharedFolderController {
  private logger = new Logger(this.constructor.name);

  @Get(SharedFolderRoute.sharedFolder)
  @GetSharedFolderDocs()
  async getSharedFolder(
    @Query(DtoValidation.pipe) query: PathParamDto,
  ): Promise<FolderInfo> {
    this.logger.verbose(`Getting shared folder ${query.path}`);

    return query as any;
  }

  @Get(SharedFolderRoute.fileStream)
  @GetFileDocs()
  async getFile(
    @Query(DtoValidation.pipe) query: PathParamDto,
    @ResponseDecorator({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    this.logger.verbose(`Getting file ${query.path}`);

    console.log(response);

    return query as any;
  }

  @Post(SharedFolderRoute.zipFile)
  @HttpCode(200)
  @GetZipFileDocs()
  async getFilesCompressed(
    @Body(DtoValidation.pipe) body: ZipFilesDto,
    @ResponseDecorator({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    this.logger.verbose(`Compressing zip files...`);

    console.log(response);

    return body as any;
  }
}
