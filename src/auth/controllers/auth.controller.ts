import { Body, Controller } from '@nestjs/common';

import { Logger } from '../../common/decorators';
import { DtoValidation } from '../../common/pipes';
import { PostAuthRegisterDocs } from '../docs/post-auth-register.docs';
import { UserDto } from '../dtos';
import { AuthRoute } from '../enums';
import { AuthService } from '../services';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Logger() private logger: Logger;

  // @UseGuards(AuthGuard('local'))
  // @Post('login')
  // async login(@Request() req) {
  //   // Aquí, normalmente generarías y devolverías un JWT
  //   return req.user;
  // }

  @PostAuthRegisterDocs()
  async register(@Body(DtoValidation.pipe) body: UserDto) {
    this.logger.log(`POST ${AuthRoute.register}: register user.`);

    return this.authService.add(body);
  }
}
