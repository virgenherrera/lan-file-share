import { Test, TestingModule } from '@nestjs/testing';
import { NotFound } from '../../core/exceptions';
import {
  FileSystemServiceProvider,
  mockFileSystemService,
} from '../../upload/services/__mocks__';
import { FolderInfo } from '../models';
import { FolderInfoService } from './folder-info.service';

describe(`UT:${FolderInfoService.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    getPathInfo = 'Should get path contents.',
    throwInexistentPath = 'Should throw 404 when trying to locate an Inexistent file.',
  }

  let service: FolderInfoService = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileSystemServiceProvider, FolderInfoService],
    }).compile();

    service = module.get(FolderInfoService);
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(FolderInfoService);
  });

  it(should.getPathInfo, async () => {
    const mockPath = '';
    const mockDirContent = ['Foo', 'Bar', 'Baz'];
    const mockStat: any[] = [
      { isDirectory: () => true },
      { isDirectory: () => false },
      { isDirectory: () => false },
    ];
    const mockParsedPath = {
      name: 'mock-name',
      base: 'mock-base',
    };

    mockFileSystemService.resolve = jest.fn().mockReturnValue(mockPath);
    mockFileSystemService.existsSync = jest.fn().mockReturnValue(true);
    mockFileSystemService.readdir = jest.fn().mockReturnValue(mockDirContent);
    mockFileSystemService.join = jest
      .fn()
      .mockImplementation((...args) => args.join('/'));
    mockFileSystemService.stat = jest
      .fn()
      .mockReturnValue(mockStat[0])
      .mockReturnValue(mockStat[1])
      .mockReturnValue(mockStat[2]);
    mockFileSystemService.parse = jest.fn().mockReturnValue(mockParsedPath);
    mockFileSystemService.toUrlPath = jest.fn().mockReturnValue('mock-path');

    await expect(service.findOne(mockPath)).resolves.toBeInstanceOf(FolderInfo);
  });

  it(should.throwInexistentPath, async () => {
    const mockPath = '';

    mockFileSystemService.resolve = jest.fn().mockReturnValue(mockPath);
    mockFileSystemService.existsSync = jest.fn().mockReturnValue(false);

    await expect(service.findOne(mockPath)).rejects.toBeInstanceOf(NotFound);
  });
});
