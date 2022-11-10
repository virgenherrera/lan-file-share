import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetSharedFolderQueryDto {
  @ApiProperty({ description: 'a PATH to sub folder to fetch content data' })
  @IsOptional()
  @IsString()
  path = '';
}
