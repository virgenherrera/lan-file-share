import { ValueProvider } from '@nestjs/common';

import { FolderInfoService } from './folder-info.service';
import { StreamableFileService } from './streamable-file.service';
import { StreamableZipFileService } from './streamable-zip-file.service';

export const mockFolderInfoService = {
  findOne: jest.fn(),
  getFullPath: jest.fn(),
} as const;

export const mockStreamableFileService = {
  findOne: jest.fn(),
} as const;

export const mockStreamableZipFileService = {
  create: jest.fn(),
} as const;

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
