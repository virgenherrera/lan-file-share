import { Test, TestingModule } from '@nestjs/testing';

import { UploadFileDto } from '../dto';
import {
  mockUploadRepository,
  UploadRepositoryProvider,
} from '../repositories/__mocks__';
import { UploadController } from './upload.controller';

describe(`UT:${UploadController.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    uploadFile = 'Should upload a File.',
    uploadManyFiles = 'Should upload a bunch of Files.',
  }

  let controller: UploadController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [UploadRepositoryProvider],
    }).compile();

    controller = module.get(UploadController);
  });

  it(should.createInstance, () => {
    expect(controller).not.toBeNull();
    expect(controller).toBeInstanceOf(UploadController);
  });
  it(should.uploadFile, async () => {
    const mockBody: UploadFileDto = {
      path: 'fake/path',
      file: undefined,
      overwrite: false,
    };
    const mockFile: any = {};
    const mockData = { foo: 'bar' };

    mockUploadRepository.create = jest.fn().mockResolvedValue(mockData);

    const serviceSpy = jest.spyOn(mockUploadRepository, 'create');

    await expect(controller.uploadOneFile(mockBody, mockFile)).resolves.toBe(
      mockData,
    );
    expect(serviceSpy).toHaveBeenCalled();
  });

  it(should.uploadManyFiles, async () => {
    const mockBody: any = { path: 'fake/path' };
    const mockFiles: any[] = [{}, {}];
    const mockData = { foo: 'bar' };

    mockUploadRepository.batchCreate = jest.fn().mockResolvedValue(mockData);

    const serviceSpy = jest.spyOn(mockUploadRepository, 'batchCreate');

    await expect(controller.uploadManyFiles(mockBody, mockFiles)).resolves.toBe(
      mockData,
    );
    expect(serviceSpy).toHaveBeenCalled();
  });
});
