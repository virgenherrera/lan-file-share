import { StreamableFile } from '@nestjs/common';
import { ReadStream } from 'fs';

type ResponseHeaders =
  | 'Content-Type'
  | 'Content-Disposition'
  | 'Content-Length';

export class DownloadableFile {
  headers: Record<ResponseHeaders, string> = {
    'Content-Disposition': '',
    'Content-Length': '',
    'Content-Type': '',
  };
  streamableFile: StreamableFile;

  constructor(
    fileName: string,
    mimeType: string,
    fileStream: ReadStream,
    fileSize: number,
  ) {
    this.headers['Content-Disposition'] = `attachment; filename="${fileName}"`;
    this.headers['Content-Length'] = `${fileSize}`;
    this.headers['Content-Type'] = mimeType;
    this.streamableFile = new StreamableFile(fileStream);
  }
}
