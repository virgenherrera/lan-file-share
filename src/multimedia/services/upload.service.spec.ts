import { Test, TestingModule } from '@nestjs/testing';
import { BadRequest } from '../../core/exceptions';
import { MockLoggerProvider } from '../../core/services/__mocks__';
import { UploadManyResponse, UploadResponse } from '../models';
import { UploadService } from './upload.service';
import { FileSystemServiceProvider, mockFileSystemService } from './__mocks__';

describe(`UT:${UploadService.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    throwBadRequestOnAlreadyExistingFile = 'should throw BadRequest on already existing file.',
    createFile = 'should upload a file properly.',
    createManyFiles = 'should upload a bunch of files properly.',
  }

  let service: UploadService = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockLoggerProvider, FileSystemServiceProvider, UploadService],
    }).compile();

    service = module.get(UploadService);
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(UploadService);
  });

  it(should.throwBadRequestOnAlreadyExistingFile, async () => {
    const file = {
      destination: 'fake/destination/path',
      originalname: 'fake-file.ext',
      path: 'fake/shared/folder/uploaded-file.ext',
    } as Express.Multer.File;

    mockFileSystemService.join = jest
      .fn()
      .mockImplementation((...args: any[]) => args.pop());
    mockFileSystemService.existsSync = jest.fn().mockReturnValue(true);
    mockFileSystemService.unlink = jest.fn().mockResolvedValue(undefined);

    await expect(service.singleFile(file)).rejects.toBeInstanceOf(BadRequest);
  });

  it(should.createFile, async () => {
    const file = {
      destination: 'fake/destination/path',
      originalname: 'fake-file.ext',
      path: 'fake/shared/folder/uploaded-file.ext',
    } as Express.Multer.File;

    mockFileSystemService.join = jest
      .fn()
      .mockImplementation((...args: any[]) => args.pop());
    mockFileSystemService.existsSync = jest.fn().mockReturnValue(false);

    mockFileSystemService.mkdir = jest.fn();
    mockFileSystemService.rename = jest.fn();

    await expect(service.singleFile(file)).resolves.toBeInstanceOf(
      UploadResponse,
    );
  });

  it(should.createFile, async () => {
    const file = {
      destination: 'fake/destination/path',
      originalname: 'fake-file.ext',
      path: 'fake/shared/folder/uploaded-file.ext',
    } as Express.Multer.File;
    const files = [file, file];

    mockFileSystemService.join = jest
      .fn()
      .mockImplementation((...args: any[]) => args.pop());
    mockFileSystemService.existsSync = jest
      .fn()
      .mockImplementationOnce(() => true)
      .mockImplementationOnce(() => false);

    mockFileSystemService.mkdir = jest.fn();
    mockFileSystemService.rename = jest.fn();

    await expect(service.multipleFiles(files, '')).resolves.toBeInstanceOf(
      UploadManyResponse,
    );
  });
});
