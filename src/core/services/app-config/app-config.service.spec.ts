import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigService } from './app-config.service';

describe('UT:AppConfigService', () => {
  const enum should {
    createInstance = 'create instance Properly.',
  }
  let service: AppConfigService = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [AppConfigService],
    }).compile();

    service = module.get(AppConfigService);
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(AppConfigService);
  });
});
