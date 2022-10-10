import { NestApplication } from '@nestjs/core';
import { MultimediaRoute } from '../../../src/multimedia/enums';
import { getDownloadableFileHeaders } from '../../matchers';
import {
  dropSharedFiles,
  initSharedFiles,
  mockSharedFiles,
  TestContext,
} from '../../utils';

const enum should {
  initTestContext = 'Should test Context be properly initialized.',
  throw404 = 'Should GET 404 on non-existent file.',
  getFile = 'Should GET existent file properly.',
}

describe.skip(`e2e:(GET)${MultimediaRoute.fileStream}`, () => {
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

  it(should.throw404, async () => {
    const path = 'path/to/non/existent/file.ext';
    const url = MultimediaRoute.fileStream.replace('*', path);
    const { status, body } = await testCtx.request.get(url);

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

    const url = MultimediaRoute.fileStream.replace('*', filename);
    const { status, headers } = await testCtx.request.get(url);
    const fileHeadersMatcher = getDownloadableFileHeaders(filename);

    expect(status).toBe(200);
    expect(headers).toMatchObject(fileHeadersMatcher);
  });
});
