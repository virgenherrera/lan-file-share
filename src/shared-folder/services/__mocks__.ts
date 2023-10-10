import { ValueProvider } from '@nestjs/common';
import { FolderInfoService } from './folder-info.service';
import { StreamableFileService } from './streamable-file.service';
import { StreamableZipFileService } from './streamable-zip-file.service';

type MockedFolderInfoService = {
  [K in keyof FolderInfoService]: jest.MockedFunction<FolderInfoService[K]>;
};

export const mockFolderInfoService: MockedFolderInfoService = {
  findOne: jest.fn(),
  getFullPath: jest.fn(),
};

export const FolderInfoServiceMockProvider: ValueProvider = {
  provide: FolderInfoService,
  useValue: mockFolderInfoService,
};

export const mockStreamableFileService: Record<
  keyof StreamableFileService,
  any
> = {
  findOne: jest.fn(),
};

export const StreamableFileMockService: ValueProvider = {
  provide: StreamableFileService,
  useValue: mockStreamableFileService,
};

export const mockStreamableZipFileService: Record<
  keyof StreamableZipFileService,
  any
> = {
  create: jest.fn(),
};

export const StreamableZipFileMockService: ValueProvider = {
  provide: StreamableZipFileService,
  useValue: mockStreamableZipFileService,
};
