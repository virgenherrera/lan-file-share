import { applyDecorators } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
} from '@nestjs/swagger';

export function GetLogsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get logFile for an specific date.' }),
    ApiHeader({
      name: 'authorization',
      required: true,
      description: 'base64-encoded credentials as described by: RFC 7617',
    }),
    ApiParam({
      name: 'logFile',
      required: true,
      description: 'logFile date matching YYYY-MM-DD format.',
    }),
    ApiProduces('text/plain'),
    ApiResponse({
      status: 200,
    }),
  );
}
