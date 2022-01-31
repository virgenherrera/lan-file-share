import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, Matches } from 'class-validator';

export class LogFileDto {
  @ApiProperty({ description: 'as defined by APP_USER in env. file' })
  @IsDefined()
  @IsString()
  username: string;

  @ApiProperty({ description: 'as defined by APP_PASS in env. file' })
  @IsDefined()
  @IsString()
  password: string;

  @ApiProperty({ description: 'date matching YYYY-MM-DD format .' })
  @IsDefined()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  logFile: string;
}
