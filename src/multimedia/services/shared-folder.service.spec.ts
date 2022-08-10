import { Test, TestingModule } from '@nestjs/testing';
import { BadRequest } from '../../core/exceptions';
import { DownloadableFile, FolderInfo } from '../models';
import { SharedFolderService } from './shared-folder.service';
import { FileSystemServiceProvider, mockFileSystemService } from './__mocks__';

describe(`UT:${SharedFolderService.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    fileToDownloadNotFound = 'Should throw BadRequest if file does not exists.',
    getDownloadableFile = 'Should get a file to download and its metadata.',
    getPathInfo = 'Should get path contents.',
  }

  const mockReadStream = {
    pipe: jest.fn().mockReturnThis(),
    on: jest.fn().mockImplementation((_event, handler) => {
      handler();

      return this;
    }),
  };
  let service: SharedFolderService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileSystemServiceProvider, SharedFolderService],
    }).compile();

    service = module.get(SharedFolderService);
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(SharedFolderService);
  });

  it(should.fileToDownloadNotFound, async () => {
    const mockPath = '/public/index.html';

    mockFileSystemService.resolve = jest.fn().mockReturnValue(mockPath);
    mockFileSystemService.existsSync = jest.fn().mockReturnValue(false);

    const existsSyncSpy = jest.spyOn(mockFileSystemService, 'existsSync');

    await expect(service.getDownloadableFile(mockPath)).rejects.toBeInstanceOf(
      BadRequest,
    );
    expect(existsSyncSpy).toHaveBeenCalledWith(mockPath);
  });

  it(should.getDownloadableFile, async () => {
    const mockPath = '/public/index.html';
    const parsed = {
      base: 'index',
      ext: '.html',
    };
    mockFileSystemService.resolve = jest.fn().mockReturnValue(mockPath);
    mockFileSystemService.existsSync = jest.fn().mockReturnValue(true);
    mockFileSystemService.createReadStream = jest
      .fn()
      .mockReturnValue(mockReadStream);
    mockFileSystemService.basename = jest.fn().mockReturnValue(parsed.base);
    mockFileSystemService.extname = jest.fn().mockReturnValue(parsed.ext);

    const existsSyncSpy = jest.spyOn(mockFileSystemService, 'existsSync');

    await expect(service.getDownloadableFile(mockPath)).resolves.toBeInstanceOf(
      DownloadableFile,
    );
    expect(existsSyncSpy).toHaveBeenCalledWith(mockPath);
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

    await expect(service.getPathInfo(mockPath)).resolves.toBeInstanceOf(
      FolderInfo,
    );
  });
});
