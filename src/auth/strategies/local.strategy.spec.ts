import { Test, TestingModule } from '@nestjs/testing';

import {
  MockAuthServiceProvider,
  mockAuthService,
} from '../services/__mocks__';
import { LocalStrategy } from './local.strategy';

describe(`UT:${LocalStrategy.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    validateValidUser = 'should validate a valid user.',
    throwForInvalidUser = 'should throw for invalid user.',
  }

  let strategy: LocalStrategy = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockAuthServiceProvider, LocalStrategy],
    }).compile();

    strategy = module.get(LocalStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(should.createInstance, () => {
    expect(strategy).not.toBeNull();
    expect(strategy).toBeInstanceOf(LocalStrategy);
  });

  it(should.validateValidUser, async () => {
    const user = { username: 'john', password: 'password' };

    mockAuthService.internalValidate.mockResolvedValue(user);

    const result = await strategy.validate(user.username, user.password);

    expect(result).toEqual(user);
    expect(mockAuthService.internalValidate).toHaveBeenCalledWith(user);
  });

  it(should.throwForInvalidUser, async () => {
    const user = { username: 'john', password: 'wrong-password' };

    mockAuthService.internalValidate.mockRejectedValue(
      new Error('Invalid credentials'),
    );

    await expect(
      strategy.validate(user.username, user.password),
    ).rejects.toThrow('Invalid credentials');
  });
});
