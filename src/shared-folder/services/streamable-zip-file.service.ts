import { Injectable } from '@nestjs/common';
import * as Zip from 'adm-zip';
import { format } from 'date-fns';

import { Logger } from '../../common/decorators';
import { ICreate } from '../../common/interfaces';
import { ZipFilesDto } from '../dto';
import { DownloadableZipFile } from '../models';
import { FolderInfoService } from './folder-info.service';

@Injectable()
export class StreamableZipFileService
  implements ICreate<ZipFilesDto, DownloadableZipFile>
{
  @Logger() private logger: Logger;

  constructor(private folderInfoService: FolderInfoService) {}

  async create({ filePaths }: ZipFilesDto): Promise<DownloadableZipFile> {
    this.logger.verbose(`Compressing zip files...`);

    const timestamp = format(Date.now(), 'yyyy-MM-dd KK:mm:ss');
    const filename = `compressed-files_${timestamp}.zip`;
    const memoryZipFile = filePaths
      .map(filePath => this.folderInfoService.getFullPath(filePath))
      .reduce((acc, filePath) => {
        acc.addLocalFile(filePath);

        return acc;
      }, new Zip());

    return new DownloadableZipFile(filename, memoryZipFile);
  }
}
