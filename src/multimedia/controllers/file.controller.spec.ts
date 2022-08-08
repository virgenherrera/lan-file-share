import { Test, TestingModule } from '@nestjs/testing';
import { SharedFolderServiceProvider } from '../services/__mocks__';
import { FileController } from './file.controller';

describe(`UT:${FileController.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
  }

  let controller: FileController = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [SharedFolderServiceProvider],
    }).compile();

    controller = module.get(FileController);
  });

  it(should.createInstance, () => {
    expect(controller).not.toBeNull();
    expect(controller).toBeInstanceOf(FileController);
  });
});
