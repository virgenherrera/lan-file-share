import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { BadRequest } from '../../common/exceptions';
import { MediaMimeTypes } from '../constants';
import { UploadFilesDto } from '../dto';
import { UploadRoute } from '../enums';
import { UploadedFilesInterceptor } from '../interceptors';
import { UploadManyResponse } from '../models';

export function PostUploadManyFilesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: `POST ${UploadRoute.files}`,
      description:
        'an endpoint to gracefully Upload many files and share it across your LAN.',
    }),
    UseInterceptors(UploadedFilesInterceptor(MediaMimeTypes)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      type: UploadFilesDto,
    }),
    ApiBadRequestResponse({
      type: BadRequest,
    }),
    ApiResponse({
      type: UploadManyResponse,
      status: 201,
      description: `${UploadManyResponse.name} instance containing data about uploaded files and errors.`,
    }),
  );
}
