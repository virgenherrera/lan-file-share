import { ValueProvider } from '@nestjs/common';
import { FolderInfoService } from './folder-info.service';
import { StreamableFileService } from './streamable-file.service';

export const mockFolderInfoService: Record<keyof FolderInfoService, any> = {
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
