import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';

import { Logger } from '../../common/decorators';
import { Conflict, NotFound, Unauthorized } from '../../common/exceptions';
import { LoginBodyDto, UserDto } from '../dtos';
import { AuthResponse } from '../models';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  @Logger() private logger: Logger;

  private readonly users = new Map<string, UserDto>();

  add(user: UserDto): AuthResponse {
    this.logger.log(`Adding new user.`);

    if (this.users.has(user.username))
      return this.errorHandler(
        new Conflict(`username: '${user.username}' already exists`),
      );

    const accessToken = this.generateJwt(user);

    this.users.set(user.username, user);

    return new AuthResponse({ accessToken });
  }

  internalValidate(user: LoginBodyDto): UserDto {
    this.logger.log(`internally validating User.`);

    const storedUser = this.users.get(user.username);

    if (!storedUser)
      return this.errorHandler(
        new NotFound(`username: '${user.username}' does not exists`),
      );

    if (!compareSync(user.password, storedUser.password))
      return this.errorHandler(
        new Unauthorized(`Invalid username or password`),
      );

    return storedUser;
  }

  validate(user: LoginBodyDto): AuthResponse {
    this.logger.log(`Validating User.`);

    const storedUser = this.internalValidate(user);
    const accessToken = this.generateJwt(storedUser);

    return new AuthResponse({ accessToken });
  }

  private generateJwt({ username }: UserDto): string {
    this.logger.log(`Generating JWT for a user.`);

    const payload = { username };

    return this.jwtService.sign(payload);
  }

  private errorHandler(error: Error): never {
    this.logger.error(error.message, error.stack);

    throw error;
  }
}
