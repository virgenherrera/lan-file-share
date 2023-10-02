import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JWT_SECRET } from './constants';
import { AuthController } from './controllers';
import { AuthService } from './services';
import { LocalWithJwtStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalWithJwtStrategy],
})
export class AuthModule {}
