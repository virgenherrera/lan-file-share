import { Injectable, Logger } from '@nestjs/common';
import { BadRequest } from '../../core/exceptions';
import { BatchCreated, IRepository } from '../../core/interfaces';
import { DtosWithFlags, IDto } from '../../core/interfaces/dto.interface';
import { FileSystemService } from '../../multimedia/services';
import { MulterFile } from '../interfaces';
import { UploadManyResponse, UploadResponse } from '../models';

@Injectable()
export class UploadRepository
  implements IRepository<UploadResponse, MulterFile>
{
  private logger = new Logger(this.constructor.name);

  constructor(private fs: FileSystemService) {}

  async batchCreate({
    dtos,
    path,
  }: DtosWithFlags<MulterFile>): Promise<BatchCreated<UploadResponse>> {
    const filePromises = dtos.map(dto => this.create({ dto, path }));
    const settledPromises = await Promise.allSettled(filePromises);

    return this.mapSettledToResponse(settledPromises);
  }

  async create({ dto, path = '' }: IDto<MulterFile>): Promise<UploadResponse> {
    const destinyFile = this.fs.join(dto.destination, path, dto.originalname);
    const unixPath = this.fs.toUrlPath(path, dto.originalname);

    if (this.fs.existsSync(destinyFile)) {
      const errorMessage = `File: '${unixPath}' already exists.`;

      this.logger.log(errorMessage);

      await this.fs.unlink(dto.path);

      throw new BadRequest(errorMessage);
    }

    await this.fs.mkdir(path);
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
