import { Test, TestingModule } from '@nestjs/testing';
import { MimeTypesResponse } from '../models/mime-types-response.model';
import { MimeTypesService } from './mime-types.service';

describe(`UT:${MimeTypesService.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    runOnModuleInit = 'Should execute onModuleInit method properly.',
  }

  let service: MimeTypesService = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MimeTypesService],
    }).compile();

    service = module.get(MimeTypesService);
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(MimeTypesService);
  });

  it(should.runOnModuleInit, () => {
    expect(service).toHaveProperty('onModuleInit');
    expect(typeof service.onModuleInit).toBe('function');
    expect(() => service.onModuleInit()).not.toThrow();
    expect(service.mimeTypesResponse).toBeInstanceOf(MimeTypesResponse);
  });
});
