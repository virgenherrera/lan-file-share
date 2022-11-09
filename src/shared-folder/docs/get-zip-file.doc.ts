import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { NotFound } from '../../common/exceptions';
import { ZipFilesDto } from '../dto';
import { SharedFolderRoute } from '../enums';
export function GetZipFileDocs() {
  return applyDecorators(
    ApiOperation({
      summary: `POST ${SharedFolderRoute.zipFile}`,
      description:
        'Get a ZIP compressed file which contains containing requested files to download.',
    }),
    ApiBody({
      type: ZipFilesDto,
    }),
    ApiBadRequestResponse({
      type: NotFound,
    }),
    ApiOkResponse({
      description: `Raw ZIP File to download.`,
      schema: {
        type: 'string',
        format: 'binary',
      },
    }),
  );
}
