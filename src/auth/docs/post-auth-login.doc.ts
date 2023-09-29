import { applyDecorators, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { BadRequest, Unauthorized } from '../../common/exceptions';
import { LoginBodyDto } from '../dtos';
import { AuthRoute } from '../enums';
import { AuthResponse } from '../models';

export function PostAuthLoginDocs() {
  return applyDecorators(
    Post(AuthRoute.login),
    HttpCode(200),
    ApiOperation({
      summary: `POST ${AuthRoute.login}`,
      description: 'Login an existing user and get an access token.',
    }),
    ApiBody({
      type: LoginBodyDto,
      description: 'User login credentials',
    }),
    ApiBadRequestResponse({
      type: BadRequest,
      description: 'Invalid request data',
    }),
    ApiUnauthorizedResponse({
      type: Unauthorized,
      description: 'Invalid username or password',
    }),
    ApiOkResponse({
      type: AuthResponse,
      description: 'Successful login response with an access token',
    }),
  );
}
