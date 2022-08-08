import { Provider } from '@nestjs/common';
import { FileSystemService } from './file-system.service';
import { SharedFolderService } from './shared-folder.service';
import { UploadService } from './upload.service';

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
};

export const FileSystemServiceProvider: Provider = {
  provide: FileSystemService,
  useValue: mockFileSystemService,
};

export const mockSharedFolderService: Record<keyof SharedFolderService, any> = {
  getDownloadableFile: jest.fn(),
  getPathInfo: jest.fn(),
};

export const SharedFolderServiceProvider: Provider = {
  provide: SharedFolderService,
  useValue: mockSharedFolderService,
};

export const mockUploadService: Record<keyof UploadService, any> = {
  singleFile: jest.fn(),
  multipleFiles: jest.fn(),
};

export const UploadServiceProvider: Provider = {
  provide: UploadService,
  useValue: mockUploadService,
};
