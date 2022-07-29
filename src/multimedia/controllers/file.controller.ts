import {
  Controller,
  Get,
  Logger,
  Param,
  Response as ResponseDecorator,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { GetFileDocs, GetSharedFolderDocs } from '../docs';
import { MultimediaRoute } from '../enums';
import { FolderInfo } from '../models';
import { FileSystemService } from '../services';

@Controller()
export class FileController {
  private logger = new Logger(this.constructor.name);

  constructor(private fileSystemService: FileSystemService) {}

  @Get(MultimediaRoute.fileStream)
  @GetFileDocs()
  async getFile(
    @Param('0') filePath: string,
    @ResponseDecorator({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    this.logger.verbose(`Getting file ${filePath}`);

    const downloadableFile = await this.fileSystemService.getDownloadableFile(
      filePath,
    );

    response.set(downloadableFile.headers);

    return downloadableFile.streamableFile;
  }

  @Get(MultimediaRoute.sharedFolder)
  @GetSharedFolderDocs()
  async getSharedFolder(@Param('0') path: string): Promise<FolderInfo> {
    this.logger.verbose(`Getting shared folder ${path}`);

    return this.fileSystemService.getPathInfo(path);
  }
}
