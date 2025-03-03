import { NestApplication } from '@nestjs/core';

import { getBadRequestMatcher } from '../../matchers';
import {
  dropSharedFiles,
  initSharedFiles,
  mockSharedFiles,
  TestContext,
} from '../../utils';

const API_PATH = '/upload/file';

describe(`e2e:(POST)${API_PATH}`, () => {
  const enum should {
    initTestContext = 'Should test Context be properly initialized.',
    throwPostFile = `Should respond with 400 when calling the endpoint without a file.`,
    throwAlreadyExists = `Should respond with 400 when file already exists.`,
    postFile = `Should POST a file properly.`,
  }

  let testCtx: TestContext;

  beforeAll(async () => {
    testCtx = await TestContext.getInstance();

    await initSharedFiles(testCtx);
  });

  afterAll(async () => {
    await dropSharedFiles(testCtx);
  });

  it(should.initTestContext, () => {
    expect(testCtx).toBeDefined();
    expect(testCtx.request).toBeDefined();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.throwPostFile, async () => {
    const { status, body } = await testCtx.request.post(API_PATH);

    expect(status).toBe(400);
    expect(body).toMatchObject(
      getBadRequestMatcher('No file was received in field: "file"'),
    );
  });

  it(should.throwAlreadyExists, async () => {
    const [file] = mockSharedFiles;
    const mockBuffer = Buffer.from(file.content);
    const { status, body } = await testCtx.request
      .post(API_PATH)
      .attach('file', mockBuffer, file.filename);

    expect(status).toBe(400);
    expect(body).toMatchObject(
      getBadRequestMatcher(`File: '${file.filename}' already exists.`),
    );
  });

  it(should.postFile, async () => {
    const mockFilename = 'test-file';
    const mockBuffer = Buffer.from('another file content');
    const { status, body } = await testCtx.request
      .post(API_PATH)
      .attach('file', mockBuffer, mockFilename);

    expect(status).toBe(201);
    expect(body).toMatchObject({
      message: `successfully uploaded file`,
      path: mockFilename,
    });
  });
});
