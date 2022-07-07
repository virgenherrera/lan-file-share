import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function UploadOneDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Upload a single file.' }),
    ApiResponse({
      status: 204,
    }),
  );
}
