import { BadRequest } from '@core/exceptions';
import { ApiProperty } from '@nestjs/swagger';

export class UploadManyResponse {
  @ApiProperty() successes: Record<number, string> = {};
  @ApiProperty() errors: Record<number, BadRequest> = {};
}
