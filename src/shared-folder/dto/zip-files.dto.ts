import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsDefined, IsString } from 'class-validator';

export class ZipFilesDto {
  @ApiProperty({
    description: 'An array with PATH files to compress and download as Zip.',
  })
  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  filePaths: string[];
}
