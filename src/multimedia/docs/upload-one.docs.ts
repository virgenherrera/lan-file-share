import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UploadResponse } from '../models';

export function UploadOneDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Upload a single file.' }),
    ApiResponse({
      type: UploadResponse,
      status: 200,
      description: `${UploadResponse.name} instance containing data about uploaded file and errors.`,
    }),
  );
}
