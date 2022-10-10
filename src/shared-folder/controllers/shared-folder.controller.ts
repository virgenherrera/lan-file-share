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
import {
  FolderInfoService,
  StreamableFileService,
  StreamableZipFileService,
} from '../services';

@Controller()
export class SharedFolderController {
  private logger = new Logger(this.constructor.name);

  constructor(
    private folderInfoService: FolderInfoService,
    private streamableFileService: StreamableFileService,
    private streamableZipFileService: StreamableZipFileService,
  ) {}

  @Get(SharedFolderRoute.sharedFolder)
  @GetSharedFolderDocs()
  async getSharedFolder(
    @Query(DtoValidation.pipe) query: PathParamDto,
  ): Promise<FolderInfo> {
    this.logger.verbose(`Getting shared folder ${query.path}`);

    return this.folderInfoService.findOne(query.path);
  }

  @Get(SharedFolderRoute.fileStream)
  @GetFileDocs()
  async getFile(
    @Query(DtoValidation.pipe) query: PathParamDto,
    @ResponseDecorator({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    this.logger.verbose(`Getting file ${query.path}`);

    const downloadableFile = await this.streamableFileService.findOne(
      query.path,
    );

    response.set(downloadableFile.headers);

    return downloadableFile.streamableFile;
  }

  @Post(SharedFolderRoute.zipFile)
  @HttpCode(200)
  @GetZipFileDocs()
  async getFilesCompressed(
    @Body(DtoValidation.pipe) body: ZipFilesDto,
    @ResponseDecorator({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    this.logger.verbose(`Compressing zip files...`);

    const downloadableFile = await this.streamableZipFileService.create(body);

    response.set(downloadableFile.headers);

    return downloadableFile.streamableFile;
  }
}
