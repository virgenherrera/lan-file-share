import { Injectable, Logger } from '@nestjs/common';
import { NotFound } from '../../core/exceptions';
import { IFindOne } from '../../core/interfaces';
import { FileSystemService } from '../../upload/services';
import { FileInfo, FolderInfo } from '../models';

@Injectable()
export class FolderInfoService implements IFindOne<string, FolderInfo> {
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
        const pathToFile = this.fs.toUrlPath(path, parsedPath.base);
        const fileInfo = new FileInfo({
          path: pathToFile,
          ...elementStats,
          ...parsedPath,
        });

        folderInfo.files.push(fileInfo);
      }
    }

    return folderInfo;
  }

  getFullPath(path: string): string {
    const fullPath = this.fs.resolve(this.fs.sharedFolderPath, path);

    if (!this.fs.existsSync(fullPath)) {
      const errMsg = `Path '${path}' does not exist`;

      this.logger.error(errMsg);

      throw new NotFound(errMsg);
    }

    return fullPath;
  }
}
