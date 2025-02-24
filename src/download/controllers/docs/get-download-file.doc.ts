import { applyDecorators, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
} from '@nestjs/swagger';

export function GetDownloadFileDocs() {
  return applyDecorators(
    Get('*pathToFile'),
    ApiOperation({ summary: 'Download a file' }),
    ApiParam({
      name: 'pathToFile',
      required: true,
      description: 'Path to the file, with segments separated by slashes',
      schema: { type: 'string' },
    }),
    ApiProduces('application/octet-stream'),
    ApiOkResponse({
      description: 'File downloaded successfully',
      content: {
        'application/octet-stream': {
          schema: { type: 'string', format: 'binary' },
        },
      },
    }),
    ApiResponse({ status: 404, description: 'File not found' }),
  );
}
