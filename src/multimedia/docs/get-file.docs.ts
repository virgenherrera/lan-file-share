import { applyDecorators, StreamableFile } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetFileDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a file to download.' }),
    ApiResponse({
      type: StreamableFile,
      description: `${StreamableFile.name} instance file data  to download.`,
    }),
  );
}
