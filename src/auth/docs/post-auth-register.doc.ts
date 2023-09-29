import { applyDecorators, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { BadRequest } from '../../common/exceptions';
import { UserDto } from '../dtos';
import { AuthRoute } from '../enums';
import { AuthResponse } from '../models';

export function PostAuthRegisterDocs() {
  return applyDecorators(
    Post(AuthRoute.register),
    ApiOperation({
      summary: `POST ${AuthRoute.register}`,
      description: 'Get Service Health.',
    }),
    ApiBody({
      type: UserDto,
    }),
    ApiBadRequestResponse({
      type: BadRequest,
    }),
    ApiCreatedResponse({
      type: AuthResponse,
      status: 200,
      description: `${AuthResponse.name} object containing bearer token.`,
    }),
  );
}
