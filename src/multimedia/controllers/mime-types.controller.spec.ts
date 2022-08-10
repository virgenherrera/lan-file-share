import { Test, TestingModule } from '@nestjs/testing';
import { MimeTypesController } from './mime-types.controller';

describe(`UT:${MimeTypesController.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    getMediaMimeTypes = 'Should get MediaMimeTypes.',
  }

  let controller: MimeTypesController = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MimeTypesController],
    }).compile();

    controller = module.get(MimeTypesController);
  });

  it(should.createInstance, () => {
    expect(controller).not.toBeNull();
    expect(controller).toBeInstanceOf(MimeTypesController);
  });

  it(should.getMediaMimeTypes, async () => {
    expect(() => controller.getMimeTypes()).not.toThrow();
  });
});
