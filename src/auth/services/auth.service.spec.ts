import { Test, TestingModule } from '@nestjs/testing';
import { compareSync } from 'bcryptjs';

import { JwtService } from '@nestjs/jwt';
import { Conflict, NotFound, Unauthorized } from '../../common/exceptions';
import { MockLoggerProvider } from '../../common/services/__mocks__';
import { UserDto } from '../dtos';
import { AuthResponse } from '../models';
import { AuthService } from './auth.service';

describe(`UT:${AuthService.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    addUserSuccessfully = 'should add a user successfully.',
    throwErrorForDuplicateUser = 'should throw error for duplicate user.',
    validateValidUser = 'should validate a valid user.',
    throwErrorForInvalidUser = 'should throw error for invalid user.',
    generateJwtForUser = 'should generate JWT for a user.',
    throwErrorForNonExistentUser = 'should throw error for non-existent user.',
    checkIfUserExists = 'should check if a user exists',
  }

  const mockJwtService: Pick<JwtService, 'sign'> = {
    sign: jest.fn(),
  };
  const user: UserDto = { username: 'john', password: 'password' };
  const fakeToken = 'fake-hashed-token';

  let service: AuthService = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        MockLoggerProvider,
        AuthService,
      ],
    }).compile();

    service = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(AuthService);
  });

  it(should.addUserSuccessfully, () => {
    mockJwtService.sign = jest.fn().mockReturnValue(fakeToken);

    const signSpy = jest.spyOn(mockJwtService, 'sign');
    const response = service.addUser(user);

    expect(response).toBeInstanceOf(AuthResponse);
    expect(response.accessToken).toBe(fakeToken);
    expect(signSpy).toBeCalledWith({ username: user.username });
  });

  it(should.throwErrorForDuplicateUser, () => {
    service.addUser(user);

    const signSpy = jest.spyOn(mockJwtService, 'sign');

    expect(() => service.addUser(user)).toThrowError(
      new Conflict(`username: '${user.username}' already exists`),
    );

    expect(signSpy).toHaveBeenCalledTimes(1);
  });

  it(should.validateValidUser, () => {
    let response: AuthResponse;

    (compareSync as jest.MockedFunction<typeof compareSync>) = jest
      .fn()
      .mockReturnValue(true);

    mockJwtService.sign = jest.fn().mockReturnValue(fakeToken);
    const signSpy = jest.spyOn(mockJwtService, 'sign');

    expect(() => service.addUser(user)).not.toThrow();
    expect(
      () =>
        (response = service.validateCredentials({
          username: 'john',
          password: 'password',
        })),
    ).not.toThrow();

    expect(response).toBeInstanceOf(AuthResponse);
    expect(response.accessToken).toBe(fakeToken);
    expect(signSpy).toBeCalledWith({ username: user.username });
  });

  it(should.throwErrorForInvalidUser, () => {
    (compareSync as jest.MockedFunction<typeof compareSync>) = jest
      .fn()
      .mockReturnValue(false);

    expect(() => service.addUser(user)).not.toThrow();

    const signSpy = jest.spyOn(mockJwtService, 'sign');

    expect(() =>
      service.validateCredentials({
        username: 'john',
        password: 'wrong-password',
      }),
    ).toThrowError(new Unauthorized(`Invalid username or password`));

    expect(signSpy).toHaveBeenCalledTimes(1);
  });

  it(should.generateJwtForUser, () => {
    mockJwtService.sign = jest.fn().mockReturnValue(fakeToken);

    const signSpy = jest.spyOn(mockJwtService, 'sign');

    const response = service.addUser(user);

    expect(response).toBeInstanceOf(AuthResponse);
    expect(response.accessToken).toBe(fakeToken);
    expect(signSpy).toBeCalledWith({ username: user.username });
  });

  it(should.throwErrorForNonExistentUser, () => {
    const nonExistentUser: UserDto = {
      username: 'nonexistent',
      password: 'password',
    };

    expect(() => service.validateCredentials(nonExistentUser)).toThrowError(
      new NotFound(`username: '${nonExistentUser.username}' does not exists`),
    );
  });

  it(should.checkIfUserExists, () => {
    service.addUser(user);

    const exists = service.userExists(user.username);

    expect(exists).toBe(true);
  });
});
