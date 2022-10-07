import { Test, TestingModule } from '@nestjs/testing';
import { StreamableZipFileService } from './streamable-zip-file.service';
import { FolderInfoServiceMockProvider } from './__mocks__';

describe(`UT:${StreamableZipFileService.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
  }

  let service: StreamableZipFileService = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FolderInfoServiceMockProvider, StreamableZipFileService],
    }).compile();

    service = module.get(StreamableZipFileService);
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(StreamableZipFileService);
  });
});
