import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import {
  GetFileStreamQueryDto,
  GetSharedFolderQueryDto,
  ZipFilesDto,
} from '../dto';
import {
  FolderInfoServiceMockProvider,
  mockFolderInfoService,
  mockStreamableFileService,
  mockStreamableZipFileService,
  StreamableFileMockService,
  StreamableZipFileMockService,
} from '../services/__mocks__';
import { SharedFolderController } from './shared-folder.controller';

describe(`UT:${SharedFolderController.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    getSharedFolder = 'Should call FolderInfoServiceMockProvider service.',
    getFileStream = 'Should call StreamableFileMockService service.',
    postZipFile = 'Should call StreamableZipFileMockService service.',
  }

  let controller: SharedFolderController = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SharedFolderController],
      providers: [
        FolderInfoServiceMockProvider,
        StreamableFileMockService,
        StreamableZipFileMockService,
      ],
    }).compile();

    controller = module.get(SharedFolderController);
  });

  it(should.createInstance, () => {
    expect(controller).not.toBeNull();
    expect(controller).toBeInstanceOf(SharedFolderController);
  });

  it(should.getSharedFolder, async () => {
    const payload: GetSharedFolderQueryDto = {
      path: 'fake/path/to/file.ext',
    };
    const mockData = { key: 1, arr: [1, 2.3] };

    mockFolderInfoService.findOne = jest.fn().mockResolvedValue(mockData);

    const findOneSpy = jest.spyOn(mockFolderInfoService, 'findOne');

    await expect(controller.getSharedFolder(payload)).resolves.toBe(mockData);
    expect(findOneSpy).toHaveBeenCalledWith(payload.path);
  });

  it(should.getFileStream, async () => {
    const payload: GetFileStreamQueryDto = {
      path: 'fake/path/to/file.ext',
    };
    const response = {
      set: jest.fn(),
    } as any as Response;
    const mockData = {
      headers: { foo: 'bar' },
      streamableFile: { foo: 'bar' },
    };

    mockStreamableFileService.findOne = jest.fn().mockResolvedValue(mockData);

    const responseSetSpy = jest.spyOn(response, 'set');
    const findOneSpy = jest.spyOn(mockStreamableFileService, 'findOne');

    await expect(controller.getFile(payload, response)).resolves.toBe(
      mockData.streamableFile,
    );
    expect(responseSetSpy).toHaveBeenCalledWith(mockData.headers);
    expect(findOneSpy).toHaveBeenCalledWith(payload.path);
  });

  it(should.postZipFile, async () => {
    const payload: ZipFilesDto = {
      filePaths: [
        'fake/path/to/file-01.ext',
        'fake/path/to/file-02.ext',
        'fake/path/to/file-03.ext',
      ],
    };
    const response = {
      set: jest.fn(),
    } as any as Response;
    const mockData = {
      headers: { foo: 'bar' },
      streamableFile: { foo: 'bar' },
    };

    mockStreamableZipFileService.create = jest.fn().mockResolvedValue(mockData);

    const responseSetSpy = jest.spyOn(response, 'set');
    const createSpy = jest.spyOn(mockStreamableZipFileService, 'create');

    await expect(
      controller.getFilesCompressed(payload, response),
    ).resolves.toBe(mockData.streamableFile);
    expect(responseSetSpy).toHaveBeenCalledWith(mockData.headers);
    expect(createSpy).toHaveBeenCalledWith(payload);
  });
});
