import { ApiProperty } from '@nestjs/swagger';
import { FileInfo } from './file-info.model';

export class FolderInfo {
  @ApiProperty({ isArray: true, type: FileInfo })
  readonly files: FileInfo[] = [];

  @ApiProperty({ isArray: true, type: String })
  readonly folders: string[] = [];
}
