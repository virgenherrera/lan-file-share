import { Injectable, Logger } from '@nestjs/common';
import { IFindOne } from '../../common/interfaces';
import { MediaMimeTypeSource } from '../../upload/constants';
import { FileSystemService } from '../../upload/services';
import { DownloadableFile } from '../models';
import { FolderInfoService } from './folder-info.service';

@Injectable()
export class StreamableFileService
  implements IFindOne<string, DownloadableFile>
{
  private logger = new Logger(this.constructor.name);

  constructor(
    private fs: FileSystemService,
    private folderInfoService: FolderInfoService,
  ) {}

  async findOne(path: string): Promise<DownloadableFile> {
    this.logger.log(`Getting file ${path}`);

    const filePath = this.folderInfoService.getFullPath(path);
    const { size } = await this.fs.stat(filePath);
    const { base, ext } = this.fs.parse(filePath);
    const [, , mimeType] = MediaMimeTypeSource.find(row => row[0] === ext);
    const fileSteam = this.fs.createReadStream(filePath);

    return new DownloadableFile(base, mimeType, fileSteam, size);
  }
}
