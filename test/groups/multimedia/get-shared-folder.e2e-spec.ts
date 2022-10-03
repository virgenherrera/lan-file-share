import { NestApplication } from '@nestjs/core';
import { MultimediaRoute } from '../../../src/multimedia/enums';
import { FolderInfoMatcher } from '../../matchers/multimedia/folder-info.matcher';
import { dropSharedFiles, initSharedFiles, TestContext } from '../../utils';

const enum should {
  initTestContext = 'Should test Context be properly initialized.',
  getFolderInfo = 'Should GET folder info properly.',
}

describe.skip(`e2e:(GET)${MultimediaRoute.sharedFolder}`, () => {
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

  it(should.getFolderInfo, async () => {
    const { status, body } = await testCtx.request.get(
      MultimediaRoute.sharedFolder.replace('*', ''),
    );

    expect(status).toBe(200);
    expect(body).toMatchObject(FolderInfoMatcher);
  });
});
