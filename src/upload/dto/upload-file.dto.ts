import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UploadPathDto } from './upload-path.dto';

export class UploadFileDto extends UploadPathDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  file?: any;
}
