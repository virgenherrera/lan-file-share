import { ValueProvider } from '@nestjs/common';

import { AuthService } from './auth.service';

export const mockAuthService = {
  addUser: jest.fn(),
  validateCredentials: jest.fn(),
  userExists: jest.fn(),
} as const;

export const MockAuthServiceProvider: ValueProvider = {
  provide: AuthService,
  useValue: mockAuthService,
};
