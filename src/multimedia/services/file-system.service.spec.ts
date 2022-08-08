import { Test, TestingModule } from '@nestjs/testing';
import { FileSystemService } from './file-system.service';

describe.skip(`UT:${FileSystemService.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    callMethods = 'Should call methods.',
  }

  const fsMock = {
    createReadStream: jest.fn(),
    existsSync: jest.fn(),
    promises: {
      mkdir: jest.fn().mockResolvedValue(''),
      readdir: jest.fn().mockResolvedValue(''),
      rename: jest.fn().mockResolvedValue(''),
      stat: jest.fn().mockResolvedValue(''),
      unlink: jest.fn().mockResolvedValue(''),
    },
  };
  const pathMock = {
    basename: jest.fn(),
    extname: jest.fn(),
    join: jest.fn(),
    parse: jest.fn(),
    resolve: jest.fn(),
  };
  let service: FileSystemService = null;

  beforeAll(async () => {
    jest.mock('fs', () => fsMock);
    jest.mock('path', () => pathMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [FileSystemService],
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

  it(should.callMethods, async () => {
    expect(() => service.toUrlPath('foo', 'bar')).not.toThrow();
    expect(() => service.createReadStream('foo')).not.toThrow();
    expect(() => service.existsSync('foo')).not.toThrow();

    await expect(service.mkdir('foo')).resolves.not.toThrow();
    await expect(service.readdir('foo')).resolves.not.toThrow();
    await expect(service.rename('foo', 'bar')).resolves.not.toThrow();
    await expect(service.stat('foo')).resolves.not.toThrow();
    await expect(service.unlink('foo')).resolves.not.toThrow();

    expect(() => service.basename('foo')).not.toThrow();
    expect(() => service.extname('foo')).not.toThrow();
    expect(() => service.join('foo')).not.toThrow();
    expect(() => service.resolve('foo')).not.toThrow();
    expect(() => service.parse('foo')).not.toThrow();
  });
});
