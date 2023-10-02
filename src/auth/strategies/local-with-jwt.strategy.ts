import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWT_SECRET, STRATEGY_NAME } from '../constants';
import { UserDto } from '../dtos';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalWithJwtStrategy extends PassportStrategy(
  Strategy,
  STRATEGY_NAME,
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate({ username }: Pick<UserDto, 'username'>): Promise<boolean> {
    return this.authService.userExists(username);
  }
}
