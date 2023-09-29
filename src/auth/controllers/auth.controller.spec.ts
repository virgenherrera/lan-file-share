import { Test, TestingModule } from '@nestjs/testing';

import { LoginBodyDto, UserDto } from '../dtos';
import {
  MockAuthServiceProvider,
  mockAuthService,
} from '../services/__mocks__';
import { AuthController } from './auth.controller';

describe(`UT:${AuthController.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    registerUserSuccessfully = 'should register user successfully.',
    loginUserSuccessfully = 'should login user successfully.',
  }

  let controller: AuthController = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockAuthServiceProvider],
      controllers: [AuthController],
    }).compile();

    controller = module.get(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(should.createInstance, () => {
    expect(controller).not.toBeNull();
    expect(controller).toBeInstanceOf(AuthController);
  });

  it(should.registerUserSuccessfully, async () => {
    const user: UserDto = { username: 'john', password: 'password' };

    mockAuthService.add.mockResolvedValue(user);

    const result = await controller.register(user);

    expect(result).toEqual(user);
    expect(mockAuthService.add).toHaveBeenCalledWith(user);
  });

  it(should.loginUserSuccessfully, async () => {
    const user: LoginBodyDto = { username: 'john', password: 'password' };

    mockAuthService.validate.mockResolvedValue({ accessToken: 'fake-token' });

    const result = await controller.login(user);

    expect(result).toEqual({ accessToken: 'fake-token' });
    expect(mockAuthService.validate).toHaveBeenCalledWith(user);
  });
});
