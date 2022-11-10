import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadPathDto {
  @ApiPropertyOptional({
    description: 'an optional PATH where to store the new file or files.',
  })
  @IsOptional()
  @IsString()
  path = '';
}
