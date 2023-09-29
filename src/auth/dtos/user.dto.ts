import { ApiProperty } from '@nestjs/swagger';
import { hashSync } from 'bcryptjs';
import { Transform } from 'class-transformer';
import { IsDefined, IsString, MinLength } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  @MinLength(4)
  username: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  @MinLength(4)
  @Transform(({ value }) => hashSync(value, 10))
  password: string;
}
