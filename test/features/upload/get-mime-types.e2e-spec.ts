import { NestApplication } from '@nestjs/core';
import { UploadRoute } from '../../../src/upload/enums';
import { GetMimeTypesMatcher } from '../../matchers';
import { TestContext } from '../../utils';

const enum should {
  initTestContext = 'Should test Context be properly initialized.',
  getMimeTypes = `Should GET allowed mime-types.`,
}

describe(`e2e:(GET)${UploadRoute.mimeTypes}`, () => {
  let testCtx: TestContext = null;

  beforeAll(async () => (testCtx = await TestContext.getInstance()));

  it(should.initTestContext, async () => {
    expect(testCtx).not.toBeNull();
    expect(testCtx.request).not.toBeNull();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.getMimeTypes, async () => {
    const { status, body } = await testCtx.request.get(UploadRoute.mimeTypes);

    expect(status).toBe(200);
    expect(body).toMatchObject(GetMimeTypesMatcher);
  });
});
