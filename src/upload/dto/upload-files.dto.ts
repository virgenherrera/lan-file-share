import { ApiProperty } from '@nestjs/swagger';
import { UploadPathDto } from './upload-path.dto';

export class UploadFilesDto extends UploadPathDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  'files[]'?: any;
}
