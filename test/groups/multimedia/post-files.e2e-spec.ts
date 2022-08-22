import { NestApplication } from '@nestjs/core';
import { join } from 'path';
import { Test } from 'supertest';
import { MultimediaRoute } from '../../../src/multimedia/enums';
import { UploadManyResponse } from '../../../src/multimedia/models';
import { MulterConfig } from '../../../src/multimedia/modules';
import { FileSystemService } from '../../../src/multimedia/services';
import { TestContext } from '../../utils';

const enum should {
  initTestContext = 'Should test Context be properly initialized.',
  throwPostFile = `Should respond with 400 when calling the endpoint without a file.`,
  postFiles = `Should POST many files properly.`,
}

describe(`e2e: POST${MultimediaRoute.files}`, () => {
  const mockFiles = [
    { filename: 'fake_file_1.txt', buffer: Buffer.from('mock file content') },
    { filename: 'fake_file_2.txt', buffer: Buffer.from('mock file content') },
    { filename: 'fake_file_3.txt', buffer: Buffer.from('mock file content') },
  ];
  const deleteMockFiles = async () => {
    const { sharedFolderPath } = testCtx.app.get(MulterConfig);
    const fs = testCtx.app.get(FileSystemService);

    for await (const mock of mockFiles) {
      const filePath = join(sharedFolderPath, mock.filename);

      if (fs.existsSync(filePath)) await fs.unlink(filePath);
    }
  };
  let testCtx: TestContext = null;

  beforeAll(async () => (testCtx = await TestContext.getInstance()));

  beforeEach(deleteMockFiles);

  afterEach(deleteMockFiles);

  it(should.initTestContext, async () => {
    expect(testCtx).not.toBeNull();
    expect(testCtx.request).not.toBeNull();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.throwPostFile, async () => {
    const { status, body } = await testCtx.request.post(MultimediaRoute.files);

    expect(status).toBe(400);
    expect(body).toMatchObject({
      code: 'bad-request-error',
      message: 'Bad Request',
      details: ['No files uploaded.'],
    });
  });

  it(should.postFiles, async () => {
    let requestor: Test;
    const matcher: Record<keyof UploadManyResponse, any> = {
      successes: {},
      errors: {},
    };

    for (let idx = 0; idx < mockFiles.length; idx++) {
      const mock = mockFiles[idx];

      if (!idx) requestor = testCtx.request.post(MultimediaRoute.files);

      requestor.attach('file[]', mock.buffer, mock.filename);
      matcher.successes[idx] = `successfully uploaded file: '${mock.filename}'`;
    }

    const { status, body } = await requestor;

    expect(status).toBe(201);
    expect(body).toMatchObject(matcher);
  });
});
