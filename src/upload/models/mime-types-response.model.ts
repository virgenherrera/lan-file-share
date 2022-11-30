import { ApiProperty } from '@nestjs/swagger';
import { MimeKind } from '../interfaces';

export class MimeTypesResponse implements Record<MimeKind, string[]> {
  @ApiProperty({ isArray: true, type: String }) application: string[] = [];
  @ApiProperty({ isArray: true, type: String }) audio: string[] = [];
  @ApiProperty({ isArray: true, type: String }) font: string[] = [];
  @ApiProperty({ isArray: true, type: String }) image: string[] = [];
  @ApiProperty({ isArray: true, type: String }) text: string[] = [];
  @ApiProperty({ isArray: true, type: String }) video: string[] = [];
}
