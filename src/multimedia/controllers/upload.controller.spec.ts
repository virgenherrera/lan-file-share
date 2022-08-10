import { Test, TestingModule } from '@nestjs/testing';
import { BadRequest } from '../../core/exceptions';
import {
  mockUploadService,
  UploadServiceProvider,
} from '../services/__mocks__';
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
      providers: [UploadServiceProvider],
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
    const serviceSpy = jest.spyOn(mockUploadService, 'singleFile');

    await expect(
      controller.uploadOne(mockBody, mockFile),
    ).rejects.toBeInstanceOf(BadRequest);
    expect(serviceSpy).not.toHaveBeenCalled();
  });

  it(should.uploadFile, async () => {
    const mockBody = { path: 'fake/path' };
    const mockFile: any = {};
    const mockData = { foo: 'bar' };

    mockUploadService.singleFile = jest.fn().mockResolvedValue(mockData);

    const serviceSpy = jest.spyOn(mockUploadService, 'singleFile');

    await expect(controller.uploadOne(mockBody, mockFile)).resolves.toBe(
      mockData,
    );
    expect(serviceSpy).toHaveBeenCalledWith(mockFile, mockBody.path);
  });

  it(should.throwMissingFiles, async () => {
    const mockBody = { path: 'fake/path' };
    const mockFiles: any[] = [];
    const serviceSpy = jest.spyOn(mockUploadService, 'multipleFiles');

    await expect(
      controller.uploadMany(mockBody, mockFiles),
    ).rejects.toBeInstanceOf(BadRequest);
    expect(serviceSpy).not.toHaveBeenCalled();
  });

  it(should.uploadManyFiles, async () => {
    const mockBody = { path: 'fake/path' };
    const mockFiles: any[] = [{}, {}];
    const mockData = { foo: 'bar' };

    mockUploadService.multipleFiles = jest.fn().mockResolvedValue(mockData);

    const serviceSpy = jest.spyOn(mockUploadService, 'multipleFiles');

    await expect(controller.uploadMany(mockBody, mockFiles)).resolves.toBe(
      mockData,
    );
    expect(serviceSpy).toHaveBeenCalledWith(mockFiles, mockBody.path);
  });
});
