import { NestApplication } from '@nestjs/core';
import { MultimediaRoute } from '../../../src/multimedia/enums';
import {
  dropSharedFiles,
  initSharedFiles,
  mockSharedFiles,
  TestContext,
} from '../../utils';

const enum should {
  initTestContext = 'Should test Context be properly initialized.',
  throw404Files = 'Should throw 404 when any of the files does not exists.',
  getZipFile = 'Should respond with Zipped file properly.',
}

describe.skip(`e2e:(POST)${MultimediaRoute.zipFile}`, () => {
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

  it(should.throw404Files, async () => {
    const reqBody = {
      filePaths: ['non-existent-file-01.txt'],
    };
    const { status, body } = await testCtx.request
      .post(MultimediaRoute.zipFile)
      .send(reqBody);

    expect(status).toBe(404);
    expect(body).toMatchObject({
      code: 'not-found-error',
      message: 'Not Found',
      details: reqBody.filePaths.map(file => `Path '${file}' does not exist`),
    });
  });

  it(should.getZipFile, async () => {
    const reqBody = {
      filePaths: mockSharedFiles.map(({ filename }) => filename),
    };
    const { status, headers } = await testCtx.request
      .post(MultimediaRoute.zipFile)
      .send(reqBody);

    expect(status).toBe(200);
    expect(headers).toMatchObject({
      'content-type': 'application/zip',
      'content-disposition': expect.stringMatching(
        /^attachment;\sfilename="compressed-files_.+"$/,
      ),
      'content-length': expect.stringMatching(/^\d+$/),
    });
  });
});
