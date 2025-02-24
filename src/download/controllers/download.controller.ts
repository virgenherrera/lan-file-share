import { Controller, Param, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Logger } from '../../common/decorators';
import { WildCardToPathPipe } from '../pipes';
import { DownloadService } from '../services';
import { GetDownloadFileDocs } from './docs';

@ApiTags('download')
@Controller('download')
export class DownloadController {
  @Logger() private readonly logger: Logger;

  constructor(private readonly downloadService: DownloadService) {}

  @GetDownloadFileDocs()
  async downloadFile(
    @Param('pathToFile', WildCardToPathPipe) pathToFile: string,
  ): Promise<StreamableFile> {
    this.logger.log(`Starting file download: ${pathToFile}`);

    return this.downloadService.getStreamableFile(pathToFile);
  }
}
