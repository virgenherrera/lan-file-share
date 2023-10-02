import { ValueProvider } from '@nestjs/common';

import { AuthService } from './auth.service';

type MockedAuthService = {
  [K in keyof AuthService]: jest.MockedFunction<AuthService[K]>;
};

export const mockAuthService: MockedAuthService = {
  addUser: jest.fn(),
  validateCredentials: jest.fn(),
  userExists: jest.fn(),
};

export const MockAuthServiceProvider: ValueProvider = {
  provide: AuthService,
  useValue: mockAuthService,
};
