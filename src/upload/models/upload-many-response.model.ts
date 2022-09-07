import { ApiProperty } from '@nestjs/swagger';
import { SoftBatchCreated } from '../../core/interfaces';

export class UploadManyResponse implements SoftBatchCreated {
  @ApiProperty() successes: Record<number, string> = {};
  @ApiProperty() errors: Record<number, string> = {};
}
