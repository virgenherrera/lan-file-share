import { Body, Controller } from '@nestjs/common';

import { Logger } from '../../common/decorators';
import { DtoValidation } from '../../common/pipes';
import { PostAuthLoginDocs } from '../docs/post-auth-login.doc';
import { PostAuthRegisterDocs } from '../docs/post-auth-register.doc';
import { LoginBodyDto, UserDto } from '../dtos';
import { AuthRoute } from '../enums';
import { AuthService } from '../services';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Logger() private logger: Logger;

  @PostAuthRegisterDocs()
  async register(@Body(DtoValidation.pipe) body: UserDto) {
    this.logger.log(`POST ${AuthRoute.register}: register user.`);

    return this.authService.add(body);
  }

  @PostAuthLoginDocs()
  async login(@Body(DtoValidation.pipe) body: LoginBodyDto) {
    this.logger.log(
      `POST ${AuthRoute.login}: attempting to authenticate: '${body.username}'.`,
    );

    return this.authService.validate(body);
  }
}
