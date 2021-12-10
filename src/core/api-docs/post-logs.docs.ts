import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { LogFileDto } from '../dtos';

export function PostLogsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get Service logs for a specific date.' }),
    ApiParam(LogFileDto),
    ApiResponse({
      type: 'text/plain',
      status: 200,
    }),
  );
}
