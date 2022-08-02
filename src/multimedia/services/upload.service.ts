import { Injectable, Logger } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { BadRequest } from '../../core/exceptions';
import { UploadManyResponse, UploadResponse } from '../models';
import { FileSystemService } from './file-system.service';

@Injectable()
export class UploadService {
  private logger = new Logger(this.constructor.name);

  constructor(private fileSystemService: FileSystemService) {}

  async singleFile(file: Express.Multer.File, subPath = '') {
    const destinyFile = join(file.destination, subPath, file.originalname);
    const unixPath = this.fileSystemService.toUnixPath(
      subPath,
      file.originalname,
    );

    if (existsSync(destinyFile)) {
      const errorMessage = `File: '${unixPath}' already exists.`;

      this.logger.log(errorMessage);

      await this.fileSystemService.deleteFile(file.path);

      throw new BadRequest(errorMessage);
    }

    await this.fileSystemService.makeSubPath(subPath);
    await this.fileSystemService.renameFile(file.path, destinyFile);

    const msg = `successfully uploaded file: '${unixPath}'`;

    this.logger.verbose(msg);

    return new UploadResponse(msg);
  }

  async multipleFiles(files: Express.Multer.File[], path: string) {
    const filePromises = files.map(file => this.singleFile(file, path));
    const promiseResponses = await Promise.allSettled(filePromises);

    return promiseResponses.reduce((acc, curr, idx) => {
      if (curr.status === 'fulfilled') {
        acc.successes[idx] = curr.value.data;
      } else {
        acc.errors[idx] = curr.reason.response.details[0];
      }

      return acc;
    }, new UploadManyResponse());
  }
}
