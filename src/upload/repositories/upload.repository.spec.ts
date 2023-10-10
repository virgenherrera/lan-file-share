import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';

import { BadRequest } from '../../common/exceptions';
import { UploadPathDto } from '../dto';
import { UploadResponse } from '../models';
import { UploadRepository } from './upload.repository';

describe(`UT:${UploadRepository.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    uploadFileSuccessfully = 'should upload a file successfully.',
    failWhenFileExists = 'should fail when file exists and overwrite is false.',
    overwriteWhenFileExistsAndOverwriteIsTrue = 'should overwrite when file exists and overwrite is true.',
    failBatchUploadWhenSomeFilesExist = 'should fail batch upload when some files exist.',
    overwriteBatchUploadWhenSomeFilesExistAndOverwriteIsTrue = 'should overwrite batch upload when some files exist and overwrite is true.',
  }

  let service: UploadRepository = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadRepository],
    }).compile();

    service = module.get(UploadRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(UploadRepository);
  });

  it(should.uploadFileSuccessfully, async () => {
    const mockFile = {
      destination: '/tmp',
      originalname: 'testFile.txt',
      path: '/tmp/testFile.txt',
    } as Express.Multer.File;

    const mockUploadPathDto: UploadPathDto = {
      path: '/upload',
      overwrite: false,
    };

    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const mkdirSpy = jest
      .spyOn(fs.promises, 'mkdir')
      .mockResolvedValue(undefined);
    const renameSpy = jest
      .spyOn(fs.promises, 'rename')
      .mockResolvedValue(undefined);
    const unlinkSpy = jest
      .spyOn(fs.promises, 'unlink')
      .mockResolvedValue(undefined);

    await expect(
      service.create(mockFile, mockUploadPathDto),
    ).resolves.toBeInstanceOf(UploadResponse);

    expect(existsSyncSpy).toHaveBeenCalledWith(expect.any(String));
    expect(mkdirSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
    );
    expect(renameSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
    );
    expect(unlinkSpy).not.toHaveBeenCalled();
  });

  it(should.failWhenFileExists, async () => {
    const mockFile = {
      destination: '/tmp',
      originalname: 'testFile.txt',
      path: '/tmp/testFile.txt',
    } as Express.Multer.File;

    const mockUploadPathDto: UploadPathDto = {
      path: '/upload',
      overwrite: false,
    };

    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const unlinkSpy = jest
      .spyOn(fs.promises, 'unlink')
      .mockResolvedValue(undefined);

    await expect(
      service.create(mockFile, mockUploadPathDto),
    ).rejects.toBeInstanceOf(BadRequest);

    expect(existsSyncSpy).toHaveBeenCalledWith(expect.any(String));
    expect(unlinkSpy).toHaveBeenCalledWith(mockFile.path);
  });

  it(should.overwriteWhenFileExistsAndOverwriteIsTrue, async () => {
    const mockFile = {
      destination: '/tmp',
      originalname: 'testFile.txt',
      path: '/tmp/testFile.txt',
    } as Express.Multer.File;

    const mockUploadPathDto: UploadPathDto = {
      path: '/upload',
      overwrite: true, // Aquí se establece la sobreescritura.
    };

    const existsSyncSpy = jest.spyOn(fs, 'existsSync');
    const mkdirSpy = jest
      .spyOn(fs.promises, 'mkdir')
      .mockResolvedValue(undefined);
    const renameSpy = jest
      .spyOn(fs.promises, 'rename')
      .mockResolvedValue(undefined);

    await expect(
      service.create(mockFile, mockUploadPathDto),
    ).resolves.toBeInstanceOf(UploadResponse);

    expect(existsSyncSpy).not.toHaveBeenCalled();
    expect(mkdirSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
    );
    expect(renameSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
    );
  });

  it(should.failBatchUploadWhenSomeFilesExist, async () => {
    const mockFiles = [
      {
        destination: '/tmp',
        originalname: 'testFile1.txt',
        path: '/tmp/testFile1.txt',
      },
      {
        destination: '/tmp',
        originalname: 'testFile2.txt',
        path: '/tmp/testFile2.txt',
      },
    ] as Express.Multer.File[];

    const mockUploadPathDto: UploadPathDto = {
      path: '/upload',
      overwrite: false,
    };

    const existsSyncSpy = jest
      .spyOn(fs, 'existsSync')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const result = await service.batchCreate(mockFiles, mockUploadPathDto);

    expect(result.errors).toHaveProperty('1');
    expect(existsSyncSpy).toHaveBeenCalledTimes(2);
  });

  it(
    should.overwriteBatchUploadWhenSomeFilesExistAndOverwriteIsTrue,
    async () => {
      const mockFiles = [
        {
          destination: '/tmp',
          originalname: 'testFile1.txt',
          path: '/tmp/testFile1.txt',
        },
        {
          destination: '/tmp',
          originalname: 'testFile2.txt',
          path: '/tmp/testFile2.txt',
        },
      ] as Express.Multer.File[];

      const mockUploadPathDto: UploadPathDto = {
        path: '/upload',
        overwrite: true,
      };

      const existsSyncSpy = jest
        .spyOn(fs, 'existsSync')
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      const result = await service.batchCreate(mockFiles, mockUploadPathDto);

      expect(result.successes).toHaveProperty('0');
      expect(result.successes).toHaveProperty('1');
      expect(existsSyncSpy).not.toHaveBeenCalled();
    },
  );
});
