import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import {
  mockSharedFolderService,
  SharedFolderServiceProvider,
} from '../services/__mocks__';
import { FileController } from './file.controller';

describe(`UT:${FileController.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    getSreamableFile = 'Should get Streamable File.',
    getFolderContents = 'Should get folder contents.',
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

  it(should.getSreamableFile, async () => {
    const mockFilePath = 'fake/path';
    const response = {
      set: jest.fn(),
    } as any as Response;
    const mockData = {
      headers: { foo: 'bar' },
      streamableFile: { foo: 'bar' },
    };

    mockSharedFolderService.getDownloadableFile = jest
      .fn()
      .mockResolvedValue(mockData);

    const responseSetSpy = jest.spyOn(response, 'set');
    const serviceSpy = jest.spyOn(
      mockSharedFolderService,
      'getDownloadableFile',
    );

    await expect(controller.getFile(mockFilePath, response)).resolves.toBe(
      mockData.streamableFile,
    );
    expect(responseSetSpy).toHaveBeenCalledWith(mockData.headers);
    expect(serviceSpy).toHaveBeenCalledWith(mockFilePath);
  });

  it(should.getFolderContents, async () => {
    const mockFolderPath = 'fake/path';
    const mockData = { foo: 'bar' };

    mockSharedFolderService.getPathInfo = jest.fn().mockResolvedValue(mockData);

    const serviceSpy = jest.spyOn(mockSharedFolderService, 'getPathInfo');

    await expect(controller.getSharedFolder(mockFolderPath)).resolves.toBe(
      mockData,
    );
    expect(serviceSpy).toHaveBeenCalledWith(mockFolderPath);
  });
});
