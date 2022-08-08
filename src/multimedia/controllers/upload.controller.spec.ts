import { Test, TestingModule } from '@nestjs/testing';
import { UploadServiceProvider } from '../services/__mocks__';
import { UploadController } from './upload.controller';

describe('UploadController', () => {
  const enum should {
    createInstance = 'should create instance Properly.',
  }

  let controller: UploadController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [UploadServiceProvider],
    }).compile();

    controller = module.get(UploadController);
  });

  it(should.createInstance, () => {
    expect(controller).not.toBeNull();
    expect(controller).toBeInstanceOf(UploadController);
  });
});
