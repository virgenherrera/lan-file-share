import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { BadRequest } from '../../common/exceptions';
import { MediaMimeTypes } from '../constants';
import { UploadFileDto } from '../dto';
import { UploadRoute } from '../enums';
import { UploadedFileInterceptor } from '../interceptors';
import { UploadResponse } from '../models';

export function PostUploadOneFileDocs() {
  return applyDecorators(
    ApiOperation({
      summary: `POST ${UploadRoute.file}`,
      description:
        'an endpoint to Upload a single file and share it across your LAN.',
    }),
    UseInterceptors(UploadedFileInterceptor(MediaMimeTypes)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      type: UploadFileDto,
    }),
    ApiBadRequestResponse({
      type: BadRequest,
    }),
    ApiOkResponse({
      type: UploadResponse,
      status: 200,
      description: `${UploadResponse.name} object containing data about uploaded file.`,
    }),
  );
}
