import { genSaltSync } from 'bcryptjs';

export const STRATEGY_NAME = 'jwt-local';
export const JWT_SECRET = genSaltSync();
