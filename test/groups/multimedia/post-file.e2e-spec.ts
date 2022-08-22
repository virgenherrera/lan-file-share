import { NestApplication } from '@nestjs/core';
import { join } from 'path';
import { MultimediaRoute } from '../../../src/multimedia/enums';
import { MulterConfig } from '../../../src/multimedia/modules';
import { FileSystemService } from '../../../src/multimedia/services';
import { TestContext } from '../../utils';

const enum should {
  initTestContext = 'Should test Context be properly initialized.',
  throwPostFile = `Should respond with 400 when calling the endpoint without a file.`,
  throwAlreadyExists = `Should respond with 400 when file already exists.`,
  postFile = `Should POST a file properly.`,
}

describe(`e2e:(POST)${MultimediaRoute.file}`, () => {
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
    expect(testCtx).not.toBeNull();
    expect(testCtx.request).not.toBeNull();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.throwPostFile, async () => {
    const { status, body } = await testCtx.request.post(MultimediaRoute.file);

    expect(status).toBe(400);
    expect(body).toMatchObject({
      code: 'bad-request-error',
      message: 'Bad Request',
      details: ['No file uploaded.'],
    });
  });

  it(should.throwAlreadyExists, async () => {
    const req1 = await testCtx.request
      .post(MultimediaRoute.file)
      .attach('file', mockBuffer, mockFilename);

    expect(req1.status).toBe(201);
    expect(req1.body).toMatchObject({
      data: `successfully uploaded file: '${mockFilename}'`,
    });

    const req2 = await testCtx.request
      .post(MultimediaRoute.file)
      .attach('file', mockBuffer, mockFilename);

    expect(req2.status).toBe(400);
    expect(req2.body).toMatchObject({
      code: 'bad-request-error',
      message: 'Bad Request',
      details: [`File: '${mockFilename}' already exists.`],
    });
  });

  it(should.postFile, async () => {
    const { status, body } = await testCtx.request
      .post(MultimediaRoute.file)
      .attach('file', mockBuffer, mockFilename);

    expect(status).toBe(201);
    expect(body).toMatchObject({
      data: `successfully uploaded file: '${mockFilename}'`,
    });
  });
});
