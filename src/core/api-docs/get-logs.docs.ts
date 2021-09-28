import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { LogFiltersDto } from '../dtos';
import { LogResponse } from '../models';

export function GetLogsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get Service logs.' }),
    ApiParam(LogFiltersDto),
    ApiResponse({
      type: LogResponse,
      status: 200,
    }),
  );
}
