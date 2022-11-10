import { Test, TestingModule } from '@nestjs/testing';
import { BadRequest } from '../../common/exceptions';
import {
  mockUploadRepository,
  UploadRepositoryProvider,
} from '../repositories/__mocks__';
import { UploadController } from './upload.controller';

describe('UploadController', () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    throwMissingFile = 'Should throw 400 when no file was received.',
    uploadFile = 'Should upload a File.',
    throwMissingFiles = 'Should throw 400 when no files ware received.',
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

  it(should.throwMissingFile, async () => {
    const mockBody = { path: 'fake/path' };
    const mockFile: any = undefined;
    const serviceSpy = jest.spyOn(mockUploadRepository, 'create');

    await expect(
      controller.uploadOneFile(mockBody, mockFile),
    ).rejects.toBeInstanceOf(BadRequest);
    expect(serviceSpy).not.toHaveBeenCalled();
  });

  it(should.uploadFile, async () => {
    const mockBody = { path: 'fake/path' };
    const mockFile: any = {};
    const mockData = { foo: 'bar' };

    mockUploadRepository.create = jest.fn().mockResolvedValue(mockData);

    const serviceSpy = jest.spyOn(mockUploadRepository, 'create');

    await expect(controller.uploadOneFile(mockBody, mockFile)).resolves.toBe(
      mockData,
    );
    expect(serviceSpy).toHaveBeenCalled();
  });

  it(should.throwMissingFiles, async () => {
    const mockBody: any = { path: 'fake/path' };
    const mockFiles: any[] = [];
    const serviceSpy = jest.spyOn(mockUploadRepository, 'batchCreate');

    await expect(
      controller.uploadManyFiles(mockBody, mockFiles),
    ).rejects.toBeInstanceOf(BadRequest);
    expect(serviceSpy).not.toHaveBeenCalled();
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
