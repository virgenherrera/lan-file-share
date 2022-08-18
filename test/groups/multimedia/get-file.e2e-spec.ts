import { NestApplication } from '@nestjs/core';
import { join } from 'path';
import { MultimediaRoute } from '../../../src/multimedia/enums';
import { MulterConfig } from '../../../src/multimedia/modules';
import { FileSystemService } from '../../../src/multimedia/services';
import { getFileHeaders } from '../../matchers';
import { TestContext } from '../../utils';

const enum should {
  initTestContext = 'Should test Context be properly initialized.',
  throw404 = 'Should GET 404 on non existent file.',
  getFile = 'Should GET existent file properly.',
}

describe(`e2e:(GET)${MultimediaRoute.fileStream}`, () => {
  const mockFilename = 'fake_file_name.txt';
  const mockBuffer = Buffer.from('some data');
  const deleteMockFile = async () => {
    const { sharedFolderPath } = testCtx.app.get(MulterConfig);
    const fs = testCtx.app.get(FileSystemService);
    const filePath = join(sharedFolderPath, mockFilename);

    if (fs.existsSync(filePath)) await fs.unlink(filePath);
  };
  let testCtx: TestContext = null;

  beforeAll(async () => (testCtx = await TestContext.getInstance()));

  beforeEach(deleteMockFile);

  afterEach(deleteMockFile);

  it(should.initTestContext, async () => {
    expect(testCtx.app).not.toBeNull();
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
    const req1 = await testCtx.request
      .post(MultimediaRoute.file)
      .attach('file', mockBuffer, mockFilename);

    expect(req1.status).toBe(201);
    expect(req1.body).toMatchObject({
      data: `successfully uploaded file: '${mockFilename}'`,
    });

    const url = MultimediaRoute.fileStream.replace('*', mockFilename);
    const req2 = await testCtx.request.get(url);
    const fileHeadersMatcher = getFileHeaders(mockFilename);

    expect(req2.status).toBe(200);
    expect(req2.headers).toMatchObject(fileHeadersMatcher);
  });
});
