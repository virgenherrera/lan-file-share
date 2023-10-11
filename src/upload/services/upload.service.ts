import { Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { mkdir, rename, unlink } from 'fs/promises';
import { join } from 'path';

import { Logger } from '../../common/decorators';
import { BadRequest } from '../../common/exceptions';
import { SoftBatchCreated } from '../../common/interfaces';
import { UploadPathDto } from '../dto';
import { UploadManyResponse, UploadResponse } from '../models';

@Injectable()
export class UploadService {
  @Logger() private logger: Logger;

  async batchCreate(
    files: Express.Multer.File[],
    opts: UploadPathDto,
  ): Promise<SoftBatchCreated<UploadResponse>> {
    const filePromises = files.map(file => this.create(file, opts));
    const settledPromises = await Promise.allSettled(filePromises);

    return this.mapSettledToResponse(settledPromises);
  }

  async create(
    file: Express.Multer.File,
    { path, overwrite }: UploadPathDto,
  ): Promise<UploadResponse> {
    const destinyPath = join(file.destination, path);
    const destinyFilePath = join(destinyPath, file.originalname);
    const unixPath = join(path, file.originalname).replace(/\\/g, '/');

    if (!overwrite && existsSync(destinyFilePath)) {
      const errorMessage = `File: '${unixPath}' already exists.`;

      this.logger.log(errorMessage);

      await unlink(file.path);

      throw new BadRequest(errorMessage);
    }

    await mkdir(destinyPath, { recursive: true });
    await rename(file.path, destinyFilePath);

    const res = new UploadResponse(unixPath);

    this.logger.verbose(res.message);

    return res;
  }

  private mapSettledToResponse(
    promises: PromiseSettledResult<UploadResponse>[],
  ): UploadManyResponse {
    return promises.reduce((acc, curr, idx) => {
      if (curr.status === 'fulfilled') {
        acc.successes[idx] = curr.value;
      } else {
        acc.errors[idx] = curr.reason.response?.details[0];
      }

      return acc;
    }, new UploadManyResponse());
  }
}
