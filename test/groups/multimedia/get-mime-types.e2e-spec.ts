import { NestApplication } from '@nestjs/core';
import { MultimediaRoute } from '../../../src/multimedia/enums';
import { GetMimeTypesMatcher } from '../../matchers';
import { TestContext } from '../../utils';

const enum should {
  initModule = 'Should init Context Properly.',
  getMimeTypes = `Should GET allowed mime-types.`,
}

describe(`e2e: (GET)${MultimediaRoute.mimeTypes}`, () => {
  let testCtx: TestContext = null;

  beforeAll(async () => (testCtx = await TestContext.build()));

  it(should.initModule, async () => {
    expect(testCtx.app).not.toBeNull();
    expect(testCtx.request).not.toBeNull();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.getMimeTypes, async () => {
    const { status, body } = await testCtx.request.get(
      MultimediaRoute.mimeTypes,
    );

    expect(status).toBe(200);
    expect(body).toMatchObject(GetMimeTypesMatcher);
  });
});
