import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import * as path from 'path';

import { NotFound } from '../../common/exceptions';
import { MulterConfig } from '../../upload/imports';
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
      providers: [
        {
          provide: MulterConfig,
          useValue: {
            sharedFolderPath: 'mock-path',
          },
        },
        FolderInfoService,
      ],
    }).compile();

    service = module.get(FolderInfoService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(FolderInfoService);
  });

  it(should.getPathInfo, async () => {
    const mockPath = 'mock-path';
    const mockFullPath = 'mock-full-path';
    const mockFiles = ['file1', 'file2'] as any as fs.Dirent[];

    const resolveSpy = jest
      .spyOn(path, 'resolve')
      .mockReturnValue(mockFullPath);
    const joinSpy = jest
      .spyOn(path, 'join')
      .mockImplementation((...args) => args.join('/'));
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const readdirSpy = jest
      .spyOn(fs.promises, 'readdir')
      .mockResolvedValue(mockFiles);
    const statSpy = jest.spyOn(fs.promises, 'stat').mockResolvedValue({
      isDirectory: () => false,
    } as fs.Stats);

    await expect(service.findOne(mockPath)).resolves.toBeInstanceOf(FolderInfo);

    expect(resolveSpy).toHaveBeenCalledWith(expect.any(String), mockPath);
    expect(existsSyncSpy).toHaveBeenCalledWith(mockFullPath);
    expect(readdirSpy).toHaveBeenCalledWith(mockFullPath);
    expect(statSpy).toHaveBeenCalledTimes(mockFiles.length);

    // Verificando que join fue llamado correctamente para cada elemento en pathContentList
    mockFiles.forEach(file => {
      expect(joinSpy).toHaveBeenCalledWith(mockFullPath, file);
      expect(joinSpy).toHaveBeenCalledWith(mockPath, file);
    });
  });

  it(should.throwInexistentPath, async () => {
    const mockPath = 'non-existent-path';
    const mockFullPath = 'non-existent-full-path';

    const resolveSpy = jest
      .spyOn(path, 'resolve')
      .mockReturnValue(mockFullPath);
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false); // Simulando que el path no existe

    await expect(service.findOne(mockPath)).rejects.toThrow(NotFound);

    expect(resolveSpy).toHaveBeenCalledWith(expect.any(String), mockPath);
    expect(existsSyncSpy).toHaveBeenCalledWith(mockFullPath);
  });
});
