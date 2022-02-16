import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AppConfigService } from '../services';

@Injectable()
export class AppAuthGuard implements CanActivate {
  private logger = new Logger(this.constructor.name);

  constructor(private appConfigService: AppConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const { headers } = context.switchToHttp().getRequest<Request>();
    const { username, password } = this.getBasicAuthCredentials(
      headers.authorization,
    );

    return this.validateAppCredentials(username, password);
  }

  private getBasicAuthCredentials(authorization = '') {
    this.logger.log(`parsing authorization header: ${authorization}`);

    try {
      const [, token] = `${authorization}`.match(/Basic\s(.+)/);
      const auth = Buffer.from(token, 'base64').toString();
      const [username, password] = auth.split(/:/);

      return { username, password };
    } catch (error) {
      throw new UnauthorizedException(
        'missing required Basic Authorization strategy header.',
      );
    }
  }

  private validateAppCredentials(username: string, password: string): boolean {
    this.logger.log(
      `validating received appCredentials: ${username}:${password}`,
    );

    const APP_USER = this.appConfigService.get('APP_USER');
    const APP_PASS = this.appConfigService.get('APP_PASS');
    const usernameIsInvalid = APP_USER !== username;
    const passwordIsInvalid = APP_PASS !== password;
    const errorDetails = {
      code: 'bad-request-error',
      message: 'Bad Credentials',
      details: [],
    };

    if (usernameIsInvalid) {
      const msg = `invalid App username.`;

      this.logger.error(msg);
      errorDetails.details.push(msg);
    }

    if (passwordIsInvalid) {
      const msg = `invalid App Credentials.`;

      this.logger.error(msg);
      errorDetails.details.push(msg);
    }

    if (errorDetails.details.length) {
      throw new UnauthorizedException(errorDetails);
    }

    return true;
  }
}
