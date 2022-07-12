import { ApiProperty } from '@nestjs/swagger';

export class UploadManyResponse {
  @ApiProperty() successes: Record<number, string> = {};
  @ApiProperty() errors: Record<number, string> = {};
}
