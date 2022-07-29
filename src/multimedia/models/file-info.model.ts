import { ApiProperty } from '@nestjs/swagger';
import { parseFileSize } from '../../utils';
import { FileInfoArgs } from '../interfaces';

export class FileInfo {
  @ApiProperty() fileName: string;
  @ApiProperty() href: string;
  @ApiProperty() size: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  constructor(args: FileInfoArgs) {
    this.fileName = args.base;
    this.href = args.href;
    this.size = parseFileSize(args.size);
    this.createdAt = args.birthtime;
    this.updatedAt = args.mtime;
  }
}
