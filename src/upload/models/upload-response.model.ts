import { ApiProperty } from '@nestjs/swagger';

export class UploadResponse {
  @ApiProperty({
    description: 'Path to recently uploaded File.',
  })
  path: string;

  @ApiProperty({
    description: 'Message describing status of Upload.',
  })
  message: string;

  constructor(path: string) {
    this.path = path;
    this.message = `successfully uploaded file: '${path}'`;
  }
}
