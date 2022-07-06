import { Test, TestingModule } from '@nestjs/testing';
import { MulterConfigService } from './multer-config.service';

describe('MulterConfigService', () => {
  let service: MulterConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MulterConfigService],
    }).compile();

    service = module.get<MulterConfigService>(MulterConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
