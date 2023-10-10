import { Test, TestingModule } from '@nestjs/testing';

import { ZipFilesDto } from '../dto';
import { DownloadableZipFile } from '../models';
import {
  FolderInfoServiceMockProvider,
  mockFolderInfoService,
} from './__mocks__';
import { StreamableZipFileService } from './streamable-zip-file.service';

jest.mock(
  'adm-zip',
  () =>
    class {
      addLocalFile = jest.fn();
      toBuffer = jest.fn();
    },
);

describe(`UT:${StreamableZipFileService.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    getDownloadableZipFile = 'Should create a streamable ZIP file to download and its metadata.',
  }

  let service: StreamableZipFileService = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FolderInfoServiceMockProvider, StreamableZipFileService],
    }).compile();

    service = module.get(StreamableZipFileService);
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(StreamableZipFileService);
  });

  it(should.getDownloadableZipFile, async () => {
    const payload: ZipFilesDto = {
      filePaths: [
        'fake/path/to/file-01.ext',
        'fake/path/to/file-02.ext',
        'fake/path/to/file-03.ext',
      ],
    };

    mockFolderInfoService.getFullPath = jest.fn().mockImplementation(v => v);

    const getFullPathSpy = jest.spyOn(mockFolderInfoService, 'getFullPath');

    await expect(service.create(payload)).resolves.toBeInstanceOf(
      DownloadableZipFile,
    );

    expect(getFullPathSpy).toBeCalledTimes(payload.filePaths.length);
  });
});
