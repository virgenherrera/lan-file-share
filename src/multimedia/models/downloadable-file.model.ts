import { StreamableFile } from '@nestjs/common';
import { ReadStream } from 'fs';

export class DownloadableFile {
  headers: Record<string, string>;
  streamableFile: StreamableFile;

  constructor(fileName: string, mimeType: string, fileStream: ReadStream) {
    this.headers = {
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
    };
    this.streamableFile = new StreamableFile(fileStream);
  }
}
