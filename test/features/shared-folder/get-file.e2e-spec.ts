import { NestApplication } from '@nestjs/core';

import { SharedFolderRoute } from '../../../src/shared-folder/enums';
import { getDownloadableFileHeaders } from '../../matchers';
import {
  AuthUtil,
  dropSharedFiles,
  initSharedFiles,
  mockSharedFiles,
  TestContext,
} from '../../utils';

describe(`e2e:(GET)${SharedFolderRoute.fileStream}`, () => {
  const enum should {
    initTestContext = 'Should test Context be properly initialized.',
    throw401 = 'Should GET 401 when a request with no token occurs.',
    throw404 = 'Should GET 404 on non-existent file.',
    getFile = 'Should GET existent file properly.',
  }

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
    const path = 'path/to/non/existent/file.ext';
    const { status, body } = await testCtx.request
      .get(SharedFolderRoute.fileStream)
      .query({ path });

    expect(status).toBe(401);
    expect(body).toMatchObject({
      message: 'Unauthorized',
    });
  });

  it.only(should.throw404, async () => {
    const accessToken = await AuthUtil.getToken(testCtx);

    console.log(accessToken);

    const path = 'path/to/non/existent/file.ext';
    const { status, body } = await testCtx.request
      .get(SharedFolderRoute.fileStream)
      .set(accessToken)
      .query({ path });

    expect(status).toBe(404);
    expect(body).toMatchObject({
      code: 'not-found-error',
      message: 'Not Found',
      details: [`Path '${path}' does not exist`],
    });
  });

  it(should.getFile, async () => {
    const [firstFile] = mockSharedFiles;
    const { filename } = firstFile;

    const { status, headers } = await testCtx.request
      .get(SharedFolderRoute.fileStream)
      .query({ path: filename });
    const fileHeadersMatcher = getDownloadableFileHeaders(filename);

    expect(status).toBe(200);
    expect(headers).toMatchObject(fileHeadersMatcher);
  });
});
