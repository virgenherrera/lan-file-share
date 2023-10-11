import { AuthRoute } from '../../src/auth/enums';
import { TestContext } from './test-context.util';

export class AuthUtil {
  private static accessToken: Record<'Authorization', string> = null;

  static async getToken(
    testCtx: TestContext,
  ): Promise<typeof AuthUtil.accessToken> {
    if (!AuthUtil.accessToken) {
      const user = { username: 'e2e-Test-User', password: 'e2e-Test-Password' };
      const { body } = await testCtx.request
        .post(AuthRoute.register)
        .send(user);

      AuthUtil.accessToken = { Authorization: `Bearer ${body.accessToken}` };
    }

    return AuthUtil.accessToken;
  }
}
