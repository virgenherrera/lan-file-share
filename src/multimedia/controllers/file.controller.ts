import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Response as ResponseDecorator,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { DtoValidation } from '../../core/pipes';
import { GetFileDocs, GetSharedFolderDocs } from '../docs';
import { ZipFilesDto } from '../dto';
import { MultimediaRoute } from '../enums';
import { FolderInfo } from '../models';
import { SharedFolderService } from '../services/shared-folder.service';

@Controller()
export class FileController {
  private logger = new Logger(this.constructor.name);

  constructor(private sharedFolderService: SharedFolderService) {}

  @Get(MultimediaRoute.fileStream)
  @GetFileDocs()
  async getFile(
    @Param('0') filePath: string,
    @ResponseDecorator({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    this.logger.verbose(`Getting file ${filePath}`);

    const downloadableFile = await this.sharedFolderService.getDownloadableFile(
      filePath,
    );

    response.set(downloadableFile.headers);

    return downloadableFile.streamableFile;
  }

  @Post(MultimediaRoute.zipFile)
  @HttpCode(200)
  @GetFileDocs()
  async postZipFiles(
    @Body(DtoValidation.pipe) dto: ZipFilesDto,
    @ResponseDecorator({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    this.logger.verbose(`Compressing zip files...`);

    const downloadableFile = await this.sharedFolderService.getZippedFile(dto);

    response.set(downloadableFile.headers);

    return downloadableFile.streamableFile;
  }

  @Get(MultimediaRoute.sharedFolder)
  @GetSharedFolderDocs()
  async getSharedFolder(@Param('0') path: string): Promise<FolderInfo> {
    this.logger.verbose(`Getting shared folder ${path}`);

    return this.sharedFolderService.getPathInfo(path);
  }
}
