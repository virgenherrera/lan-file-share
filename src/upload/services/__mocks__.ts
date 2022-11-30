import { ValueProvider } from '@nestjs/common';
import { MimeTypesResponse } from '../models/mime-types-response.model';
import { FileSystemService } from './file-system.service';
import { MimeTypesService } from './mime-types.service';

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

export const FileSystemServiceProvider: ValueProvider = {
  provide: FileSystemService,
  useValue: mockFileSystemService,
};

export const mockMimeTypesService: Record<keyof MimeTypesService, any> = {
  onModuleInit: jest.fn(),
  mimeTypesResponse: new MimeTypesResponse(),
};

export const MimeTypesServiceProvider: ValueProvider = {
  provide: MimeTypesService,
  useValue: mockMimeTypesService,
};
