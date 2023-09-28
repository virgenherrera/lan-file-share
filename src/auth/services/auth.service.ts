import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';

import { Logger } from '../../common/decorators';
import { Conflict } from '../../common/exceptions';
import { UserDto } from '../dtos';
import { AuthResponse } from '../models';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  @Logger() private logger: Logger;

  private readonly users = new Map<string, UserDto>();

  add(user: UserDto): AuthResponse {
    this.logger.log(`Adding new user.`);

    if (this.users.has(user.username)) {
      const error = new Conflict(`username: '${user.username}' already exists`);

      this.logger.error(error.message, error.stack);

      throw error;
    }

    const accessToken = this.generateJwt(user);

    this.users.set(user.username, user);

    return new AuthResponse({ accessToken });
  }

  validate(username: string, password: string): UserDto | null {
    const user = this.users.get(username);

    return user && compareSync(password, user.password) ? user : null;
  }

  generateJwt({ username }: UserDto): string {
    const payload = { username };

    return this.jwtService.sign(payload);
  }
}
