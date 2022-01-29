import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
} from '@nestjs/swagger';
import { LogFileDto } from '../dtos';

export function PostLogsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get Service logs for a specific date.' }),
    ApiParam(LogFileDto),
    ApiProduces('text/plain'),
    ApiResponse({
      status: 200,
    }),
  );
}
