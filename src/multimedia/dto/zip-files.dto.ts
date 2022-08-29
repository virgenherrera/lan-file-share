import { ArrayMinSize, IsArray, IsDefined, IsString } from 'class-validator';

export class ZipFilesDto {
  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  filePaths: string[];
}
