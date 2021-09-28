import { LogLevel } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class LogFiltersDto {
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

  @ApiPropertyOptional({ description: 'lines to skip , DEFAULT: 0' })
  @IsOptional()
  @Min(0)
  @IsInt()
  skip = 0;

  @ApiPropertyOptional({ description: 'how many lines to fetch, DEFAULT: 50' })
  @IsOptional()
  @IsPositive()
  @IsInt()
  limit = 50;

  @ApiPropertyOptional({ description: 'to filter by text  "context".' })
  @IsOptional()
  @IsString()
  context?: string;

  @ApiPropertyOptional({
    description: `to filter log by "level". ALLOWS: 'log', 'error', 'warn', 'debug', 'verbose'`,
  })
  @IsOptional()
  @IsIn(['log', 'error', 'warn', 'debug', 'verbose'])
  level?: LogLevel;

  @ApiPropertyOptional({ description: 'to filter by text  "message".' })
  @IsOptional()
  @IsString()
  message?: string;
}
