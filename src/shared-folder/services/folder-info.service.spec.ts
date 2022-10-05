import { Test, TestingModule } from '@nestjs/testing';
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
      .mockResolvedValue(mockStat[0])
      .mockResolvedValue(mockStat[1])
      .mockResolvedValue(mockStat[2]);
    mockFileSystemService.parse = jest.fn().mockReturnValue(mockParsedPath);
    mockFileSystemService.toUrlPath = jest.fn().mockReturnValue('mock-path');

    await expect(service.findOne(mockPath)).resolves.toBeInstanceOf(FolderInfo);
  });
});
