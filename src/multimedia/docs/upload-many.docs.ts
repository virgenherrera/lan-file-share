import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UploadManyResponse } from '../models';

export function uploadManyDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Upload many files.' }),
    ApiResponse({
      type: UploadManyResponse,
      status: 200,
      description: `${UploadManyResponse.name} instance containing data about uploaded files and errors.`,
    }),
  );
}
