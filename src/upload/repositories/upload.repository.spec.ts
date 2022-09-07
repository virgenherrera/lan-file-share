import { Test, TestingModule } from '@nestjs/testing';
import { BadRequest } from '../../core/exceptions';
import { DtosWithFlags } from '../../core/interfaces';
import { MockLoggerProvider } from '../../core/services/__mocks__';
import { UploadManyResponse, UploadResponse } from '../../multimedia/models';
import {
  FileSystemServiceProvider,
  mockFileSystemService,
} from '../../multimedia/services/__mocks__';
import { MulterFile } from '../interfaces';
import { UploadRepository } from './upload.repository';

describe(`UT:${UploadRepository.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    throwBadRequestOnAlreadyExistingFile = 'should throw BadRequest on already existing file.',
    createFile = 'should upload a file properly.',
    createManyFiles = 'should upload a bunch of files properly.',
  }

  let service: UploadRepository = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MockLoggerProvider,
        FileSystemServiceProvider,
        UploadRepository,
      ],
    }).compile();

    service = module.get(UploadRepository);
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(UploadRepository);
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

    await expect(service.create({ dto: file })).rejects.toBeInstanceOf(
      BadRequest,
    );
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

    await expect(service.create({ dto: file })).resolves.toBeInstanceOf(
      UploadResponse,
    );
  });

  it(should.createFile, async () => {
    const file = {
      destination: 'fake/destination/path',
      originalname: 'fake-file.ext',
      path: 'fake/shared/folder/uploaded-file.ext',
    } as MulterFile;
    const payload = {
      path: '',
      dtos: [file, file],
    } as any as DtosWithFlags<MulterFile>;

    mockFileSystemService.join = jest
      .fn()
      .mockImplementation((...args: any[]) => args.pop());
    mockFileSystemService.existsSync = jest
      .fn()
      .mockImplementationOnce(() => true)
      .mockImplementationOnce(() => false);

    mockFileSystemService.mkdir = jest.fn();
    mockFileSystemService.rename = jest.fn();

    await expect(service.batchCreate(payload)).resolves.toBeInstanceOf(
      UploadManyResponse,
    );
  });
});
