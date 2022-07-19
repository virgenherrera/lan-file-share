import { Controller, Get, Logger, Param, StreamableFile } from '@nestjs/common';
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
  async getFile(@Param('0') filePath: string): Promise<StreamableFile> {
    this.logger.verbose(`Getting file ${filePath}`);

    return this.fileSystemService.getStreamableFile(filePath);
  }

  @Get(MultimediaRoute.sharedFolder)
  @GetSharedFolderDocs()
  async getSharedFolder(@Param('0') path: string): Promise<FolderInfo> {
    this.logger.verbose(`Getting shared folder ${path}`);

    return this.fileSystemService.getPathInfo(path);
  }
}
