import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UploadPathDto {
  static boolTransform({ value }: TransformFnParams) {
    return ['1', 'true', 'yes'].includes(value);
  }

  @ApiPropertyOptional({
    description: 'An optional path where to store the new file or files.',
    default: '',
  })
  @IsOptional()
  @IsString()
  path = '';

  @ApiPropertyOptional({
    description: 'Whether to overwrite existing files with the same name.',
    default: false,
  })
  @Transform(UploadPathDto.boolTransform)
  @IsBoolean()
  overwrite: boolean;
}
