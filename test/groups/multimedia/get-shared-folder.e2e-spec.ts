import { NestApplication } from '@nestjs/core';
import { MultimediaRoute } from '../../../src/multimedia/enums';
import { FileInfo, FolderInfo } from '../../../src/multimedia/models';
import { TestContext } from '../../utils';

const enum should {
  initTestContext = 'Should test Context be properly initialized.',
  getFolderInfo = 'Should GET folder info properly.',
}

describe(`e2e:(GET)${MultimediaRoute.sharedFolder}`, () => {
  let testCtx: TestContext = null;

  beforeAll(async () => (testCtx = await TestContext.getInstance()));

  it(should.initTestContext, async () => {
    expect(testCtx.app).not.toBeNull();
    expect(testCtx.request).not.toBeNull();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.getFolderInfo, async () => {
    const fileInfoMatcher: Record<keyof FileInfo, any> = {
      fileName: expect.any(String),
      href: expect.any(String),
      size: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    };
    const bodyMatcher: Record<keyof FolderInfo, any> = {
      files: expect.arrayContaining([fileInfoMatcher]),
      folders: expect.arrayContaining([expect.any(String)]),
    };
    const { status, body } = await testCtx.request.get(
      MultimediaRoute.sharedFolder.replace('*', ''),
    );

    expect(status).toBe(200);
    expect(body).toMatchObject(bodyMatcher);
  });
});
