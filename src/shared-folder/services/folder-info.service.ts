import { Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { readdir, stat } from 'fs/promises';
import { join, parse as pathParse, resolve } from 'path';

import { Logger } from '../../common/decorators';
import { NotFound } from '../../common/exceptions';
import { IFindOne } from '../../common/interfaces';
import { MulterConfig } from '../../upload/imports';
import { FileInfo, FolderInfo } from '../models';

@Injectable()
export class FolderInfoService implements IFindOne<string, FolderInfo> {
  constructor(private multerConfig: MulterConfig) {}

  @Logger() private logger: Logger;

  async findOne(path: string): Promise<FolderInfo> {
    this.logger.log(`Getting shared folder ${path}`);

    const fullPath = this.getFullPath(path);
    const folderInfo = new FolderInfo();
    const pathContentList = await readdir(fullPath);

    for await (const pathElement of pathContentList) {
      const elementPath = join(fullPath, pathElement);
      const elementStats = await stat(elementPath);
      const parsedPath = pathParse(elementPath);
      const urlPath = join(path, parsedPath.base).replace(/\\/g, '/');

      if (elementStats.isDirectory()) {
        folderInfo.folders.push(urlPath);
      } else {
        const fileInfo = new FileInfo({
          path: urlPath,
          ...elementStats,
          ...parsedPath,
        });

        folderInfo.files.push(fileInfo);
      }
    }

    return folderInfo;
  }

  getFullPath(path: string): string {
    const fullPath = resolve(this.multerConfig.sharedFolderPath, path);

    if (!existsSync(fullPath)) {
      const errMsg = `Path '${path}' does not exist`;

      this.logger.error(errMsg);

      throw new NotFound(errMsg);
    }

    return fullPath;
  }
}
