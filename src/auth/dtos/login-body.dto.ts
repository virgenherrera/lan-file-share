import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, MinLength } from 'class-validator';
import { UserDto } from './user.dto';

export class LoginBodyDto implements UserDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  @MinLength(4)
  username: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  @MinLength(4)
  password: string;
}
