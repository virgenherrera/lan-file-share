import { NestApplication } from '@nestjs/core';
import { AuthRoute } from '../../../src/auth/enums';
import { TestContext } from '../../utils';

describe(`e2e:(POST)${AuthRoute.register}`, () => {
  const enum should {
    initTestContext = 'Should test Context be properly initialized.',
    registerNewUser = 'Should register a new user successfully.',
    throwForDuplicateUser = 'Should throw error for duplicate user registration.',
  }

  let testCtx: TestContext = null;

  beforeAll(async () => {
    testCtx = await TestContext.getInstance();
  });

  it(should.initTestContext, async () => {
    expect(testCtx).not.toBeNull();
    expect(testCtx.request).not.toBeNull();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.registerNewUser, async () => {
    const user = { username: 'e2eTestUser', password: 'e2eTestPassword' };
    const response = await testCtx.request.post(AuthRoute.register).send(user);

    expect(response.status).toBe(201);
    expect(response.body.accessToken).toBeDefined();
  });

  it(should.throwForDuplicateUser, async () => {
    const user = {
      username: 'e2eTestUserDuplicate',
      password: 'e2eTestPassword',
    };

    const firstResponse = await testCtx.request
      .post(AuthRoute.register)
      .send(user);
    expect(firstResponse.status).toBe(201);

    const secondResponse = await testCtx.request
      .post(AuthRoute.register)
      .send(user);

    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body.message).toBe('Conflict');
  });
});
