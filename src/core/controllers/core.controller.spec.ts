import { Test, TestingModule } from '@nestjs/testing';
import { MockLoggerProvider } from '../../utils/testing';
import { CoreService } from '../services';
import { CoreController } from './core.controller';

describe('UT:CoreController', () => {
  const enum should {
    createInstance = 'should create instance Properly.',
  }
  const mockHealthService: Record<keyof CoreService, any> = {
    getHealth: () => this,
  };
  let controller: CoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoreController],
      providers: [
        { provide: CoreService, useValue: mockHealthService },
        MockLoggerProvider,
      ],
    }).compile();

    controller = module.get(CoreController);
  });

  it(should.createInstance, () => {
    expect(controller).not.toBeNull();
    expect(controller).toBeInstanceOf(CoreController);
  });
});
