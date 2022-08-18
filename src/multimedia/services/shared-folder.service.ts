import { Injectable, Logger } from '@nestjs/common';
import { Stats } from 'fs';
import { ParsedPath } from 'path';
import { NotFound } from '../../core/exceptions';
import { MediaMimeTypeSource } from '../constants';
import { MultimediaRoute } from '../enums';
import { DownloadableFile, FileInfo, FolderInfo } from '../models';
import { FileSystemService } from './file-system.service';

@Injectable()
export class SharedFolderService {
  private logger = new Logger(this.constructor.name);

  constructor(private fs: FileSystemService) {}

  async getDownloadableFile(path: string): Promise<DownloadableFile> {
    this.logger.log(`Getting file ${path}`);

    const filePath = this.getFullPath(path);
    const { size } = await this.fs.stat(filePath);
    const { base, ext } = this.fs.parse(filePath);
    const [, , mimeType] = MediaMimeTypeSource.find(row => row[0] === ext);
    const fileSteam = this.fs.createReadStream(filePath);

    return new DownloadableFile(base, mimeType, fileSteam, size);
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
    const fullPath = this.fs.resolve(this.fs.sharedFolderPath, path);

    if (!this.fs.existsSync(fullPath)) {
      const errMsg = `Path '${path}' does not exist`;

      this.logger.error(errMsg);

      throw new NotFound(errMsg);
    }

    return fullPath;
  }
}
