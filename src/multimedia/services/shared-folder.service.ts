import { Injectable, Logger } from '@nestjs/common';
import { Stats } from 'fs';
import { ParsedPath } from 'path';
import { BadRequest } from '../../core/exceptions';
import { MediaMimeTypeSource, SHARED_FOLDER_PATH } from '../constants';
import { MultimediaRoute } from '../enums';
import { DownloadableFile, FileInfo, FolderInfo } from '../models';
import { FileSystemService } from './file-system.service';

@Injectable()
export class SharedFolderService {
  private logger = new Logger(this.constructor.name);
  private readonly sharedFolderPath = SHARED_FOLDER_PATH;

  constructor(private fs: FileSystemService) {}

  async getDownloadableFile(path: string): Promise<DownloadableFile> {
    this.logger.log(`Getting file ${path}`);

    const filePath = this.getFullPath(path);
    const fileSteam = this.fs.createReadStream(filePath);
    const fileName = this.fs.basename(filePath);
    const fileExt = this.fs.extname(filePath);
    const [, , mimeType] = MediaMimeTypeSource.find(row => row[0] === fileExt);

    return new DownloadableFile(fileName, mimeType, fileSteam);
  }

  async getPathInfo(path = ''): Promise<FolderInfo> {
    this.logger.log(`Getting shared folder ${path}`);

    const fullPath = this.getFullPath(path);
    const folderInfo = new FolderInfo();
    const pathContentList = await this.fs.readdir(fullPath);

    for await (const pathElement of pathContentList) {
      const elementPath = this.fs.join(fullPath, pathElement);
      const elementStats = await this.fs.stat(elementPath);
      const parsedPath = this.fs.parse(elementPath);

      if (elementStats.isDirectory()) {
        const childPath = this.fs.toUrlPath(path, parsedPath.name);

        folderInfo.folders.push(childPath);
      } else {
        const fileInfo = this.getFileInfo(path, parsedPath, elementStats);

        folderInfo.files.push(fileInfo);
      }
    }

    return folderInfo;
  }

  private getFileInfo(
    path: string,
    parsedPath: ParsedPath,
    elementStats: Stats,
  ) {
    const href = this.fs.toUrlPath(
      '/api/v1',
      MultimediaRoute.fileStream.replace('*', ''),
      path,
      parsedPath.base,
    );

    return new FileInfo({
      href,
      ...elementStats,
      ...parsedPath,
    });
  }

  private getFullPath(path: string): string {
    const fullPath = this.fs.resolve(this.sharedFolderPath, path);

    if (!this.fs.existsSync(fullPath)) {
      const errMsg = `Path ${path} does not exist`;

      this.logger.error(errMsg);

      throw new BadRequest(errMsg);
    }

    return fullPath;
  }
}
