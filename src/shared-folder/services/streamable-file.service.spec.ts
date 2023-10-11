import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import * as path from 'path';

import {
  MockMimeServiceProvider,
  mockMimeService,
} from '../../mime/services/__mocks__';
import { DownloadableFile } from '../models';
import {
  FolderInfoServiceMockProvider,
  mockFolderInfoService,
} from './__mocks__';
import { StreamableFileService } from './streamable-file.service';

describe(`UT:${StreamableFileService.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    getDownloadableFile = 'Should get a file to download and its metadata.',
  }

  const mockReadStream = {
    pipe: jest.fn().mockReturnThis(),
    on: jest.fn().mockImplementation((_event, handler) => {
      handler();

      return this;
    }),
  };
  let service: StreamableFileService = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FolderInfoServiceMockProvider,
        MockMimeServiceProvider,
        StreamableFileService,
      ],
    }).compile();

    service = module.get(StreamableFileService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(StreamableFileService);
  });

  it(should.getDownloadableFile, async () => {
    const mockPath = 'mock-path';
    const mockFullPath = 'mock-full-path';
    const mockFileName = 'mock-file';
    const mockFileSize = 12345;

    jest.spyOn(path, 'parse').mockReturnValue({
      base: mockFileName,
      ext: '.mock',
    } as any as path.ParsedPath);

    const statSpy = jest.spyOn(fs.promises, 'stat').mockResolvedValue({
      size: mockFileSize,
    } as fs.Stats);

    const createReadStreamSpy = jest
      .spyOn(fs, 'createReadStream')
      .mockReturnValue(mockReadStream as any);

    jest
      .spyOn(mockFolderInfoService, 'getFullPath')
      .mockReturnValue(mockFullPath);

    jest.spyOn(mockMimeService, 'getMime').mockReturnValue('.ext');

    await expect(service.findOne(mockPath)).resolves.toBeInstanceOf(
      DownloadableFile,
    );

    expect(statSpy).toHaveBeenCalledWith(mockFullPath);
    expect(createReadStreamSpy).toHaveBeenCalledWith(mockFullPath);
  });
});
