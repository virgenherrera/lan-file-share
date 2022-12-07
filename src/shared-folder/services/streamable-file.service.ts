import { Injectable } from '@nestjs/common';
import { Logger } from '../../common/decorators';
import { BadRequest } from '../../common/exceptions';
import { IFindOne } from '../../common/interfaces';
import { mimeTypeSource } from '../../upload/constants';
import { FileSystemService } from '../../upload/services';
import { DownloadableFile } from '../models';
import { FolderInfoService } from './folder-info.service';

@Injectable()
export class StreamableFileService
  implements IFindOne<string, DownloadableFile>
{
  @Logger() private logger: Logger;

  constructor(
    private fs: FileSystemService,
    private folderInfoService: FolderInfoService,
  ) {}

  async findOne(path: string): Promise<DownloadableFile> {
    this.logger.log(`Getting file ${path}`);

    const filePath = this.folderInfoService.getFullPath(path);
    const { size } = await this.fs.stat(filePath);
    const { base, ext } = this.fs.parse(filePath);
    const mimeType = this.getMimeType(ext);
    const fileSteam = this.fs.createReadStream(filePath);

    return new DownloadableFile(base, mimeType, fileSteam, size);
  }

  private getMimeType(ext: string): string {
    const [, , mimeType] = mimeTypeSource.find(row => row[0] === ext);

    if (!mimeType)
      throw new BadRequest(
        `Extension: '${ext}' does not match with any registered mime type.`,
      );

    return mimeType;
  }
}
