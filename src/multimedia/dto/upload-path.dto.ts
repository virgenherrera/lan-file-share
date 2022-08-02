import { IsOptional, IsString } from 'class-validator';

export class UploadPathDto {
  @IsOptional()
  @IsString()
  path: string;
}
