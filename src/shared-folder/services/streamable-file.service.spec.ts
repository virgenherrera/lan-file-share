import { Test, TestingModule } from '@nestjs/testing';
import { DownloadableFile } from '../../multimedia/models';
import {
  FileSystemServiceProvider,
  mockFileSystemService,
} from '../../upload/services/__mocks__';
import { StreamableFileService } from './streamable-file.service';
import {
  FolderInfoServiceMockProvider,
  mockFolderInfoService,
} from './__mocks__';

describe(`UT:${StreamableFileService.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    getDownloadableFile = 'Should get a file to download and its metadata.',
  }

  const mockReadStream = {
    pipe: jest.fn().mockReturnThis(),
    on: jest.fn().mockImplementation((_event, handler) => {
      handler();

      return this;
    }),
  };
  let service: StreamableFileService = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileSystemServiceProvider,
        FolderInfoServiceMockProvider,
        StreamableFileService,
      ],
    }).compile();

    service = module.get(StreamableFileService);
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(StreamableFileService);
  });

  it(should.getDownloadableFile, async () => {
    const mockPath = '/public/index.html';
    const parsed = {
      base: 'index',
      ext: '.html',
    };
    mockFileSystemService.resolve = jest.fn().mockReturnValue(mockPath);
    mockFileSystemService.existsSync = jest.fn().mockReturnValue(true);
    mockFileSystemService.stat = jest.fn().mockResolvedValue({ size: 0 });
    mockFileSystemService.parse = jest.fn().mockReturnValue(parsed);
    mockFileSystemService.createReadStream = jest
      .fn()
      .mockReturnValue(mockReadStream);

    const existsSyncSpy = jest.spyOn(mockFolderInfoService, 'getFullPath');

    await expect(service.findOne(mockPath)).resolves.toBeInstanceOf(
      DownloadableFile,
    );
    expect(existsSyncSpy).toHaveBeenCalledWith(mockPath);
  });
});
