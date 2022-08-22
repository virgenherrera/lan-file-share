import { NestApplication } from '@nestjs/core';
import { MultimediaRoute } from '../../../src/multimedia/enums';
import { TestContext } from '../../utils';

const enum should {
  initTestContext = 'Should test Context be properly initialized.',
  throw404Path = 'Should throw 404 when provided path does not exist.',
  throw404Files = 'Should throw 404 when any of the files does not exists.',
  obtainFile = 'Should respond with  Zipped file properly.',
}

describe(`e2e:(POST)${MultimediaRoute.zipFile}`, () => {
  let testCtx: TestContext = null;

  beforeAll(async () => (testCtx = await TestContext.getInstance()));

  it(should.initTestContext, async () => {
    expect(testCtx).not.toBeNull();
    expect(testCtx.request).not.toBeNull();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.throw404Path, async () => {
    const reqBody = {
      path: 'path/to/non/existent/body',
    };
    const { status, body } = await testCtx.request
      .post(MultimediaRoute.zipFile)
      .send(reqBody);

    expect(status).toBe(404);
    expect(body).toMatchObject({
      code: 'not-found-error',
      message: 'Not Found',
      details: [`Path '${reqBody.path}' does not exist`],
    });
  });

  it(should.throw404Files, async () => {
    const reqBody = {
      path: '',
      files: [
        'non-existent-file-01',
        'non-existent-file-02',
        'non-existent-file-03',
      ],
    };
    const { status, body } = await testCtx.request
      .post(MultimediaRoute.zipFile)
      .send(reqBody);

    expect(status).toBe(404);
    expect(body).toMatchObject({
      code: 'not-found-error',
      message: 'Not Found',
      details: reqBody.files.map(file => `file '${file}' does not exist`),
    });
  });

  it(should.obtainFile, async () => {
    const reqBody = {
      path: '',
    };
    const { status, headers } = await testCtx.request
      .post(MultimediaRoute.zipFile)
      .send(reqBody);

    expect(status).toBe(200);
    expect(headers).toMatchObject({
      'content-type': 'application/zip',
      'content-disposition': `attachment; filename="${'filename'}"`,
      'content-length': expect.stringMatching(/^\d+$/),
    });
  });
});
