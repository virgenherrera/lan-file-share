import { ValueProvider } from '@nestjs/common';

import { FolderInfoService } from './folder-info.service';
import { StreamableFileService } from './streamable-file.service';
import { StreamableZipFileService } from './streamable-zip-file.service';

type MockedFolderInfoService = {
  [K in keyof FolderInfoService]: jest.MockedFunction<FolderInfoService[K]>;
};
type MockedStreamableFileServiceService = {
  [K in keyof StreamableFileService]: jest.MockedFunction<
    StreamableFileService[K]
  >;
};
type MockedStreamableZipFileServiceService = {
  [K in keyof StreamableZipFileService]: jest.MockedFunction<
    StreamableZipFileService[K]
  >;
};

export const mockFolderInfoService: MockedFolderInfoService = {
  findOne: jest.fn(),
  getFullPath: jest.fn(),
};

export const mockStreamableFileService: MockedStreamableFileServiceService = {
  findOne: jest.fn(),
};

export const mockStreamableZipFileService: MockedStreamableZipFileServiceService =
  {
    create: jest.fn(),
  };

export const FolderInfoServiceMockProvider: ValueProvider = {
  provide: FolderInfoService,
  useValue: mockFolderInfoService,
};

export const StreamableFileMockService: ValueProvider = {
  provide: StreamableFileService,
  useValue: mockStreamableFileService,
};

export const StreamableZipFileMockService: ValueProvider = {
  provide: StreamableZipFileService,
  useValue: mockStreamableZipFileService,
};
