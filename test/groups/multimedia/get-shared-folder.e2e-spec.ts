import { NestApplication } from '@nestjs/core';
import { join } from 'path';
import { MultimediaRoute } from '../../../src/multimedia/enums';
import { MulterConfig } from '../../../src/multimedia/modules';
import { FileSystemService } from '../../../src/multimedia/services';
import { FolderInfoMatcher } from '../../matchers/multimedia/folder-info.matcher';
import { TestContext } from '../../utils';

const enum should {
  initTestContext = 'Should test Context be properly initialized.',
  getFolderInfo = 'Should GET folder info properly.',
}

describe(`e2e:(GET)${MultimediaRoute.sharedFolder}`, () => {
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

  afterEach(deleteMockFile);

  it(should.initTestContext, async () => {
    expect(testCtx.app).not.toBeNull();
    expect(testCtx.request).not.toBeNull();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.getFolderInfo, async () => {
    const req1 = await testCtx.request
      .post(MultimediaRoute.file)
      .attach('file', mockBuffer, mockFilename);

    expect(req1.status).toBe(201);
    expect(req1.body).toMatchObject({
      data: `successfully uploaded file: '${mockFilename}'`,
    });

    const req2 = await testCtx.request.get(
      MultimediaRoute.sharedFolder.replace('*', ''),
    );

    expect(req2.status).toBe(200);
    expect(req2.body).toMatchObject(FolderInfoMatcher);
  });
});
