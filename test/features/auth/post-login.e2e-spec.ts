import { NestApplication } from '@nestjs/core';
import { AuthRoute } from '../../../src/auth/enums';
import { TestContext } from '../../utils';

describe(`e2e:(POST)${AuthRoute.register}`, () => {
  const enum should {
    initTestContext = 'Should test Context be properly initialized.',
    loginUserSuccessfully = 'Should log in a registered user successfully.',
    failLoginForUnregisteredUser = 'Should fail to log in an unregistered user.',
    failLoginForIncorrectPassword = 'Should fail to log in with incorrect password.',
    failLoginWithoutUserData = 'Should fail to log in without user data.',
  }

  const registeredUser = {
    username: 'e2eTestUser',
    password: 'e2eTestPassword',
  };
  const unregisteredUser = {
    username: 'e2eTestUserUnregistered',
    password: 'e2eTestPassword',
  };
  let testCtx: TestContext = null;

  beforeAll(async () => {
    testCtx = await TestContext.getInstance();

    // First, register a user for the successful login test
    await testCtx.request.post(AuthRoute.register).send(registeredUser);
  });

  it(should.initTestContext, async () => {
    expect(testCtx).not.toBeNull();
    expect(testCtx.request).not.toBeNull();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.initTestContext, async () => {
    expect(testCtx).not.toBeNull();
    expect(testCtx.request).not.toBeNull();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.loginUserSuccessfully, async () => {
    const response = await testCtx.request
      .post(AuthRoute.login)
      .send(registeredUser);
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
  });

  it(should.failLoginForUnregisteredUser, async () => {
    const response = await testCtx.request
      .post(AuthRoute.login)
      .send(unregisteredUser);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Not Found');
  });

  it(should.failLoginForIncorrectPassword, async () => {
    const userWithWrongPassword = {
      ...registeredUser,
      password: 'wrongPassword',
    };
    const response = await testCtx.request
      .post(AuthRoute.login)
      .send(userWithWrongPassword);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it(should.failLoginWithoutUserData, async () => {
    const response = await testCtx.request.post(AuthRoute.login).send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Bad Request');
  });
});
