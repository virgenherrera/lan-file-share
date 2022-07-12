import { Test, TestingModule } from '@nestjs/testing';
import { BadRequest } from '../../core/exceptions';
import { MockLoggerProvider } from '../../core/services/__mocks__';
import { UploadService } from './upload.service';

describe(`UT:${UploadService.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    throwBadRequestOnAlreadyExistingFile = 'should throw BadRequest on already existing file.',
  }

  const fsMock = {
    existsSync: jest.fn(),
    promises: {
      rename: jest.fn(),
      unlink: jest.fn(),
    },
  };
  let service: UploadService = null;

  beforeAll(async () => {
    jest.mock('fs', () => fsMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [MockLoggerProvider, UploadService],
    }).compile();

    service = module.get(UploadService);
  });

  afterAll(() => {
    jest.resetAllMocks();
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

    fsMock.existsSync.mockReturnValue(true);
    fsMock.promises.unlink.mockResolvedValue(undefined);

    try {
      await service.singleFile(file);
    } catch (error) {
      console.log(error);
      expect(error).toBeInstanceOf(BadRequest);
      expect(error.details).toBe([
        `File: '${file.originalname}' already exists.`,
      ]);
    }
  });
});
