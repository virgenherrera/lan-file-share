import { ApiProperty } from '@nestjs/swagger';
import { FileInfo } from './file-info.model';

export class FolderInfo {
  @ApiProperty() readonly files: FileInfo[] = [];
  @ApiProperty() readonly folders: string[] = [];
}
