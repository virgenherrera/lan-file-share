import { IsOptional, IsString } from 'class-validator';

export class PathParamDto {
  @IsOptional()
  @IsString()
  path = '';
}
