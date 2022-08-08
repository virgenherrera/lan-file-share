import { Injectable, Logger } from '@nestjs/common';
import { BadRequest } from '../../core/exceptions';
import { UploadManyResponse, UploadResponse } from '../models';
import { FileSystemService } from './file-system.service';

@Injectable()
export class UploadService {
  private logger = new Logger(this.constructor.name);

  constructor(private fs: FileSystemService) {}

  async singleFile(file: Express.Multer.File, subPath = '') {
    const destinyFile = this.fs.join(
      file.destination,
      subPath,
      file.originalname,
    );
    const unixPath = this.fs.toUrlPath(subPath, file.originalname);

    if (this.fs.existsSync(destinyFile)) {
      const errorMessage = `File: '${unixPath}' already exists.`;

      this.logger.log(errorMessage);

      await this.fs.unlink(file.path);

      throw new BadRequest(errorMessage);
    }

    await this.fs.mkdir(subPath);
    await this.fs.rename(file.path, destinyFile);

    const msg = `successfully uploaded file: '${unixPath}'`;

    this.logger.verbose(msg);

    return new UploadResponse(msg);
  }

  async multipleFiles(files: Express.Multer.File[], path: string) {
    const filePromises = files.map(file => this.singleFile(file, path));
    const settledPromises = await Promise.allSettled(filePromises);

    return this.mapSettledToResponse(settledPromises);
  }

  private mapSettledToResponse(
    promises: PromiseSettledResult<UploadResponse>[],
  ): UploadManyResponse {
    return promises.reduce((acc, curr, idx) => {
      if (curr.status === 'fulfilled') {
        acc.successes[idx] = curr.value.data;
      } else {
        acc.errors[idx] = curr.reason.response.details[0];
      }

      return acc;
    }, new UploadManyResponse());
  }
}
