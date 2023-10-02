import { Test, TestingModule } from '@nestjs/testing';

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
    const mockUser = {
      username: 'john',
      password: 'password123',
    };

    await expect(controller.register(mockUser)).resolves.not.toThrow();
    expect(mockAuthService.addUser).toHaveBeenCalledWith(mockUser);
  });

  it(should.loginUserSuccessfully, async () => {
    const mockLoginBody = {
      username: 'john',
      password: 'password123',
    };

    await expect(controller.login(mockLoginBody)).resolves.not.toThrow();
    expect(mockAuthService.validateCredentials).toHaveBeenCalledWith(
      mockLoginBody,
    );
  });
});
