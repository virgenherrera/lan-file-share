import { Injectable, Logger } from '@nestjs/common';
import { Stats } from 'fs';
import { ParsedPath } from 'path';
import { NotFound } from '../core/exceptions';
import { IFindOne } from '../core/interfaces';
import { FileInfo, FolderInfo } from '../shared-folder/models';
import { FileSystemService } from '../upload/services';

@Injectable()
export class SharedFolderRepository implements IFindOne<string, FolderInfo> {
  private logger = new Logger(this.constructor.name);

  constructor(private fs: FileSystemService) {}

  async findOne(path: string): Promise<FolderInfo> {
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

  private getFullPath(path: string): string {
    const fullPath = this.fs.resolve(this.fs.sharedFolderPath, path);

    if (!this.fs.existsSync(fullPath)) {
      const errMsg = `Path '${path}' does not exist`;

      this.logger.error(errMsg);

      throw new NotFound(errMsg);
    }

    return fullPath;
  }

  private getFileInfo(
    path: string,
    parsedPath: ParsedPath,
    elementStats: Stats,
  ) {
    const filePath = this.fs.toUrlPath(path, parsedPath.base);

    return new FileInfo({
      path: filePath,
      ...elementStats,
      ...parsedPath,
    });
  }
}
