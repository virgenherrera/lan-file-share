import { Test, TestingModule } from '@nestjs/testing';
import { SharedFolderService } from './shared-folder.service';
import { FileSystemServiceProvider } from './__mocks__';

describe(`UT:${SharedFolderService.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
  }

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
});
