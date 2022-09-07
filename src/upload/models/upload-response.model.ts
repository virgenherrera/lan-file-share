import { ApiProperty } from '@nestjs/swagger';

export class UploadResponse {
  @ApiProperty() data: string;

  constructor(data: string) {
    this.data = data;
  }
}
