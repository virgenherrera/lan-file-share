import { applyDecorators, Post, UseInterceptors } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { HttpExceptionFilter } from '../../application/filters';
import { UploadFileDto, UploadResponse } from '../dto';
import { RequiredFileInterceptor } from '../interceptors';

export function PostUploadFileDocs() {
  return applyDecorators(
    Post('file'),
    UseInterceptors(
      RequiredFileInterceptor('file', {
        preservePath: true,
        limits: { files: 1 },
      }),
    ),
    ApiOperation({
      description:
        'an endpoint to Upload a single file and share it across your LAN.',
    }),
    ApiConsumes('multipart/form-data'),
    ...HttpExceptionFilter.getDocs(),
    ApiBody({ type: UploadFileDto }),
    ApiCreatedResponse({ type: UploadResponse }),
  );
}
