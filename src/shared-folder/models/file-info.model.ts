import { ApiProperty } from '@nestjs/swagger';
import { Stats } from 'fs';
import { ParsedPath } from 'path';
import { byteLengthHumanize } from '../../utils';

type FileInfoArgs = Stats & ParsedPath & { path: string };

export class FileInfo {
  @ApiProperty() fileName: string;
  @ApiProperty() path: string;
  @ApiProperty() size: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  constructor({ base, path, size, birthtime, mtime }: FileInfoArgs) {
    Object.assign(this, {
      fileName: base,
      path,
      size: byteLengthHumanize(size),
      createdAt: birthtime,
      updatedAt: mtime,
    });
  }
}
