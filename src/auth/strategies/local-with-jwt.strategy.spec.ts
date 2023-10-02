import { Test, TestingModule } from '@nestjs/testing';

import {
  MockAuthServiceProvider,
  mockAuthService,
} from '../services/__mocks__';
import { LocalWithJwtStrategy } from './local-with-jwt.strategy';

describe(`UT:${LocalWithJwtStrategy.name}`, () => {
  const enum should {
    createInstance = 'should create instance properly.',
    validateExistingUser = 'should validate an existing user.',
    throwForNonExistentUser = 'should return false for a non-existent user.',
  }

  let strategy: LocalWithJwtStrategy = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockAuthServiceProvider, LocalWithJwtStrategy],
    }).compile();

    strategy = module.get(LocalWithJwtStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(should.createInstance, () => {
    expect(strategy).not.toBeNull();
    expect(strategy).toBeInstanceOf(LocalWithJwtStrategy);
  });

  it(should.validateExistingUser, async () => {
    const mockUser = { username: 'john' };

    mockAuthService.userExists.mockReturnValueOnce(true);

    await expect(strategy.validate(mockUser)).resolves.toBeTruthy();
    expect(mockAuthService.userExists).toHaveBeenCalledWith(mockUser.username);
  });

  it(should.throwForNonExistentUser, async () => {
    const mockUser = { username: 'nonexistent' };

    mockAuthService.userExists.mockReturnValueOnce(false);

    await expect(strategy.validate(mockUser)).resolves.toBeFalsy();
    expect(mockAuthService.userExists).toHaveBeenCalledWith(mockUser.username);
  });
});
