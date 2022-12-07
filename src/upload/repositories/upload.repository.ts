import { Injectable } from '@nestjs/common';
import { Logger } from '../../common/decorators';
import { BadRequest } from '../../common/exceptions';
import {
  IBatchCreate,
  ICreate,
  SoftBatchCreated,
} from '../../common/interfaces';
import { FileWithDestinationPath } from '../interfaces';
import { UploadManyResponse, UploadResponse } from '../models';
import { FileSystemService } from '../services';

@Injectable()
export class UploadRepository
  implements
    IBatchCreate<FileWithDestinationPath, SoftBatchCreated<UploadResponse>>,
    ICreate<FileWithDestinationPath, UploadResponse>
{
  @Logger() private logger: Logger;

  constructor(private fs: FileSystemService) {}

  async batchCreate(
    dtos: FileWithDestinationPath[],
  ): Promise<SoftBatchCreated<UploadResponse>> {
    const filePromises = dtos.map(file => this.create(file));
    const settledPromises = await Promise.allSettled(filePromises);

    return this.mapSettledToResponse(settledPromises);
  }

  async create(dto: FileWithDestinationPath): Promise<UploadResponse> {
    const destinyFile = this.fs.join(
      dto.destination,
      dto.destinationPath,
      dto.originalname,
    );
    const unixPath = this.fs.toUrlPath(dto.destinationPath, dto.originalname);

    if (this.fs.existsSync(destinyFile)) {
      const errorMessage = `File: '${unixPath}' already exists.`;

      this.logger.log(errorMessage);

      await this.fs.unlink(dto.path);

      throw new BadRequest(errorMessage);
    }

    await this.fs.mkdir(dto.destinationPath);
    await this.fs.rename(dto.path, destinyFile);

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
