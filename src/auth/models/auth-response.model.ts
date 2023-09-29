import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty() accessToken: string;

  constructor(args: AuthResponse) {
    Object.assign(this, args);
  }
}
