import { NestApplication } from '@nestjs/core';
import { SharedFolderRoute } from '../../../src/shared-folder/enums';
import { FolderInfoMatcher } from '../../matchers';
import {
  AuthUtil,
  dropSharedFiles,
  initSharedFiles,
  TestContext,
} from '../../utils';

const enum should {
  initTestContext = 'Should test Context be properly initialized.',
  throw401 = 'Should GET 401 when a request with no token occurs.',
  getFolderInfo = 'Should GET folder info properly.',
}

describe(`e2e:(GET)${SharedFolderRoute.sharedFolder}`, () => {
  let testCtx: TestContext = null;

  beforeAll(async () => {
    testCtx = await TestContext.getInstance();

    await initSharedFiles(testCtx);
  });

  afterAll(async () => {
    await dropSharedFiles(testCtx);
  });

  it(should.initTestContext, async () => {
    expect(testCtx).not.toBeNull();
    expect(testCtx.request).not.toBeNull();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.throw401, async () => {
    const { status, body } = await testCtx.request.get(
      SharedFolderRoute.sharedFolder,
    );

    expect(status).toBe(401);
    expect(body).toMatchObject({
      message: 'Unauthorized',
    });
  });

  it(should.getFolderInfo, async () => {
    const accessToken = await AuthUtil.getToken(testCtx);
    const { status, body } = await testCtx.request
      .get(SharedFolderRoute.sharedFolder)
      .set(accessToken);

    expect(status).toBe(200);
    expect(body).toMatchObject(FolderInfoMatcher);
  });
});
