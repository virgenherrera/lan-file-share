import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { STRATEGY_NAME } from '../constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard(STRATEGY_NAME) {}
