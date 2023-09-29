import { ValueProvider } from '@nestjs/common';

import { AuthService } from './auth.service';

export const mockAuthService: Record<keyof AuthService, any> = {
  add: jest.fn(),
  internalValidate: jest.fn(),
  validate: jest.fn(),
};

export const MockAuthServiceProvider: ValueProvider = {
  provide: AuthService,
  useValue: mockAuthService,
};
