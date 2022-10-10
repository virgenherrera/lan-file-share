import { ValueProvider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import * as path from 'path';
import { MulterConfig } from '../imports';
import { FileSystemService } from './file-system.service';

describe(`UT:${FileSystemService.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    callReadDir = 'Should wrap around native "fs.promises.readdir"',
    callMkDir = 'Should wrap around native "fs.promises.mkdir"',
    callRename = 'Should wrap around native "fs.promises.rename"',
    callMethods = 'Should wrap around call "fs.promises.methods".',
    callStat = 'Should wrap around native "fs.promises.stat"',
    callUnlink = 'Should wrap around native "fs.promises.unlink"',
    callBaseName = 'Should wrap around native "path.basename"',
    callExtname = 'Should wrap around native "path.extname"',
    callJoin = 'Should wrap around native "path.join"',
    callResolve = 'Should wrap around native "path.resolve"',
    callParse = 'Should wrap around native "path.parse"',
    callToUrlPath = 'Should transform any path to a url friendly.',
    callCreateReadStream = 'Should wrap around native "path.createReadStream"',
    callExistsSync = 'Should wrap around native "path.existsSync"',
  }

  const MulterConfigProvider: ValueProvider = {
    provide: MulterConfig,
    useValue: {
      sharedFolderPath: 'fake/path',
    },
  };
  const fooArg = 'foo';
  const barArg = 'bar';
  let service: FileSystemService = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MulterConfigProvider, FileSystemService],
    }).compile();

    service = module.get(FileSystemService);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(FileSystemService);
  });

  it(should.callReadDir, async () => {
    const spy = jest.spyOn(fs.promises, 'readdir').mockResolvedValue(null);

    await expect(service.readdir(fooArg)).resolves.not.toThrow();
    expect(spy).toHaveBeenCalledWith(fooArg);
  });

  it(should.callMkDir, async () => {
    const spy = jest.spyOn(fs.promises, 'mkdir').mockResolvedValue(null);

    await expect(service.mkdir(fooArg)).resolves.not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it(should.callRename, async () => {
    const spy = jest.spyOn(fs.promises, 'rename').mockResolvedValue(null);

    await expect(service.rename(fooArg, barArg)).resolves.not.toThrow();
    expect(spy).toHaveBeenCalledWith(fooArg, barArg);
  });

  it(should.callStat, async () => {
    const spy = jest.spyOn(fs.promises, 'stat').mockResolvedValue(null);

    await expect(service.stat(fooArg)).resolves.not.toThrow();
    expect(spy).toHaveBeenCalledWith(fooArg);
  });

  it(should.callUnlink, async () => {
    const spy = jest.spyOn(fs.promises, 'unlink').mockResolvedValue(null);

    await expect(service.unlink(fooArg)).resolves.not.toThrow();
    expect(spy).toHaveBeenCalledWith(fooArg);
  });

  it(should.callBaseName, async () => {
    const spy = jest.spyOn(path, 'basename').mockReturnValue(null);

    expect(() => service.basename(fooArg)).not.toThrow();
    expect(spy).toHaveBeenCalledWith(fooArg);
  });

  it(should.callExtname, async () => {
    const spy = jest.spyOn(path, 'extname').mockReturnValue(null);

    expect(() => service.extname(fooArg)).not.toThrow();
    expect(spy).toHaveBeenCalledWith(fooArg);
  });

  it(should.callJoin, async () => {
    const spy = jest.spyOn(path, 'join').mockReturnValue(null);

    expect(() => service.join(fooArg, barArg)).not.toThrow();
    expect(spy).toHaveBeenCalledWith(fooArg, barArg);
  });

  it.skip(should.callResolve, async () => {
    const spy = jest.spyOn(path, 'resolve').mockReturnValue(null);

    expect(() => service.resolve(fooArg)).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it(should.callParse, async () => {
    const spy = jest.spyOn(path, 'parse').mockReturnValue(null);

    expect(() => service.parse(fooArg)).not.toThrow();
    expect(spy).toHaveBeenCalledWith(fooArg);
  });

  it(should.callToUrlPath, async () => {
    const pathA = '\\foo\\bar\\';
    const pathB = 'mock\\path\\';
    const mockPath = `${pathA}${pathB}`;
    const expectedValue = '/foo/bar/mock/path/';
    const spy = jest.spyOn(path, 'join').mockReturnValue(mockPath);
    let result: string = null;

    expect(() => (result = service.toUrlPath(pathA, pathB))).not.toThrow();
    expect(spy).toHaveBeenCalledWith(pathA, pathB);
    expect(result).not.toBeNull();
    expect(result).toBe(expectedValue);
  });

  it(should.callCreateReadStream, async () => {
    const spy = jest.spyOn(fs, 'createReadStream').mockReturnValue(null);

    expect(() => service.createReadStream(fooArg)).not.toThrow();
    expect(spy).toHaveBeenCalledWith(fooArg);
  });

  it(should.callExistsSync, async () => {
    const spy = jest.spyOn(fs, 'existsSync').mockReturnValue(null);

    expect(() => service.existsSync(fooArg)).not.toThrow();
    expect(spy).toHaveBeenCalledWith(fooArg);
  });
});
