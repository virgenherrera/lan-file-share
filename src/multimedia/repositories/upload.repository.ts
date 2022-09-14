import { Injectable, Logger } from '@nestjs/common';
import { BadRequest } from '../../core/exceptions';
import { IBatchCreate, ICreate, SoftBatchCreated } from '../../core/interfaces';
import { FileWithDestinationPath } from '../interfaces';
import { UploadManyResponse, UploadResponse } from '../models';
import { FileSystemService } from '../services';

@Injectable()
export class UploadRepository
  implements
    IBatchCreate<FileWithDestinationPath, SoftBatchCreated>,
    ICreate<FileWithDestinationPath, UploadResponse>
{
  private logger = new Logger(this.constructor.name);

  constructor(private fs: FileSystemService) {}

  async batchCreate(
    dtos: FileWithDestinationPath[],
  ): Promise<SoftBatchCreated> {
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

    const msg = `successfully uploaded file: '${unixPath}'`;

    this.logger.verbose(msg);

    return new UploadResponse(msg);
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
