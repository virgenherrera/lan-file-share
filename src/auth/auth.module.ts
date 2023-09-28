import { Module, Provider } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { genSaltSync } from 'bcryptjs';
import { AuthController } from './controllers';
import { AuthService } from './services';
import { LocalStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: genSaltSync(),
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {
  static providers: Provider[] = [AuthService, LocalStrategy];
}
