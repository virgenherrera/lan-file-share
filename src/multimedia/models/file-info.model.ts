import { ApiProperty } from '@nestjs/swagger';
import { byteLengthHumanize } from '../../utils';
import { FileInfoArgs } from '../interfaces';

export class FileInfo {
  @ApiProperty() fileName: string;
  @ApiProperty() href: string;
  @ApiProperty() size: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  constructor({ base, href, size, birthtime, mtime }: FileInfoArgs) {
    Object.assign(this, {
      base,
      href,
      size: byteLengthHumanize(size),
      birthtime,
      mtime,
    });
  }
}
