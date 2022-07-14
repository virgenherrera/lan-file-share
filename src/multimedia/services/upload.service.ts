import { Injectable, Logger } from '@nestjs/common';
import { existsSync } from 'fs';
import { rename, unlink } from 'fs/promises';
import { join } from 'path';
import { BadRequest } from '../../core/exceptions';
import { UploadManyResponse, UploadResponse } from '../models';

@Injectable()
export class UploadService {
  private logger = new Logger(this.constructor.name);

  async singleFile(file: Express.Multer.File) {
    const destinyFile = join(file.destination, file.originalname);

    if (existsSync(destinyFile)) {
      const errorMessage = `File: '${file.originalname}' already exists.`;

      this.logger.log(errorMessage);

      await this.deleteFile(file.path);

      throw new BadRequest(errorMessage);
    }

    await this.renameFile(file.path, destinyFile);

    this.logger.log(`successfully uploaded file: ${file.originalname}`);

    return new UploadResponse(`uploaded: '${file.originalname}'`);
  }
  async multipleFiles(files: Express.Multer.File[]) {
    const filePromises = files.map(file => this.singleFile(file));
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

  private async renameFile(oldPath: string, newPath: string) {
    await rename(oldPath, newPath);

    this.logger.verbose(`file: ${oldPath} renamed to: ${newPath}`);
  }

  private async deleteFile(filePath: string) {
    await unlink(filePath);

    this.logger.verbose(`file: ${filePath} deleted`);
  }
}
