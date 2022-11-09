import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class GetFileStreamQueryDto {
  @ApiProperty({ description: 'a PATH to file for download' })
  @IsDefined()
  @IsString()
  path: string;
}
