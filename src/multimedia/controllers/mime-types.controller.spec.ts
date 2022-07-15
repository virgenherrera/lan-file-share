import { Test, TestingModule } from '@nestjs/testing';
import { MimeTypesController } from './mime-types.controller';

describe('MimeTypesController', () => {
  let controller: MimeTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MimeTypesController],
    }).compile();

    controller = module.get<MimeTypesController>(MimeTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
