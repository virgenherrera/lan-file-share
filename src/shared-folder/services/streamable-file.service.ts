import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { parse } from 'path';

import { Logger } from '../../common/decorators';
import { IFindOne } from '../../common/interfaces';
import { MimeService } from '../../mime/services';
import { DownloadableFile } from '../models';
import { FolderInfoService } from './folder-info.service';

@Injectable()
export class StreamableFileService
  implements IFindOne<string, DownloadableFile>
{
  @Logger() private logger: Logger;

  constructor(
    private readonly folderInfoService: FolderInfoService,
    private readonly mimeService: MimeService,
  ) {}

  async findOne(path: string): Promise<DownloadableFile> {
    this.logger.log(`Getting file ${path}`);

    const filePath = this.folderInfoService.getFullPath(path);
    const { size } = await stat(filePath);
    const { base, ext } = parse(filePath);
    const mimeType = this.mimeService.getMime(ext);
    const fileSteam = createReadStream(filePath);

    return new DownloadableFile(base, fileSteam, size, mimeType);
  }
}
