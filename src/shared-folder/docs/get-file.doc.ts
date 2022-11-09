import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { NotFound } from '../../common/exceptions';
import { GetFileStreamQueryDto } from '../dto';
import { SharedFolderRoute } from '../enums';

export function GetFileDocs() {
  return applyDecorators(
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
    ApiOkResponse({
      description: `Raw File to download.`,
      schema: {
        type: 'string',
        format: 'binary',
      },
    }),
  );
}
