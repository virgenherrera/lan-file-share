import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UploadManyResponse, UploadResponse } from '../models';

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
