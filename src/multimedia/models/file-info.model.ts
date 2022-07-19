import { ApiProperty } from '@nestjs/swagger';
import { Stats } from 'fs';
import { ParsedPath } from 'path';
import { parseFileSize } from '../../utils';

export class FileInfo {
  @ApiProperty() fileName: string;
  @ApiProperty() size: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  constructor(stats: Stats, parsedPath: ParsedPath) {
    this.fileName = parsedPath.base;
    this.size = parseFileSize(stats.size);
    this.createdAt = stats.birthtime;
    this.updatedAt = stats.mtime;
  }
}
