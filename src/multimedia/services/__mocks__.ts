import { Provider } from '@nestjs/common';
import { FileSystemService } from './file-system.service';
import { SharedFolderService } from './shared-folder.service';

export const mockFileSystemService: Record<keyof FileSystemService, any> = {
  toUrlPath: jest.fn(),
  createReadStream: jest.fn(),
  existsSync: jest.fn(),
  mkdir: jest.fn(),
  readdir: jest.fn(),
  rename: jest.fn(),
  stat: jest.fn(),
  unlink: jest.fn(),
  basename: jest.fn(),
  extname: jest.fn(),
  join: jest.fn(),
  resolve: jest.fn(),
  parse: jest.fn(),
  sharedFolderPath: 'fake/path',
};

export const FileSystemServiceProvider: Provider = {
  provide: FileSystemService,
  useValue: mockFileSystemService,
};

export const mockSharedFolderService: Record<keyof SharedFolderService, any> = {
  getDownloadableFile: jest.fn(),
  getPathInfo: jest.fn(),
  getZippedFile: jest.fn(),
};

export const SharedFolderServiceProvider: Provider = {
  provide: SharedFolderService,
  useValue: mockSharedFolderService,
};
