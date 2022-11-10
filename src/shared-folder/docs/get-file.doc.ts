import { applyDecorators, Get } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiQuery,
} from '@nestjs/swagger';
import { NotFound } from '../../common/exceptions';
import { MediaMimeTypes } from '../../upload/constants';
import { GetFileStreamQueryDto } from '../dto';
import { SharedFolderRoute } from '../enums';

export function GetFileDocs() {
  return applyDecorators(
    Get(SharedFolderRoute.fileStream),
    ApiOperation({
      summary: `GET ${SharedFolderRoute.fileStream}`,
      description: 'Get a file to download.',
    }),
    ApiQuery({
      type: GetFileStreamQueryDto,
    }),
    ApiBadRequestResponse({
      type: NotFound,
    }),
    ApiProduces(...MediaMimeTypes),
    ApiOkResponse({
      description: `Raw File to download.`,
      headers: {
        'Content-Disposition': {
          schema: {
            type: 'string',
            example: 'attachment; filename="name.pdf"',
            description: `Used only with 'application/pdf' responses`,
          },
        },
      },
      schema: {
        type: 'string',
        format: 'binary',
      },
    }),
  );
}
