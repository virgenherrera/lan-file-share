import { Test } from '@nestjs/testing';
import {
  mockHealthService,
  MockHealthServiceProvider,
} from '../services/__mocks__';
import { CommonController } from './common.controller';

describe(`UT: ${CommonController.name}`, () => {
  const enum should {
    init = 'Should be initialized properly.',
    getHealth = 'Should getHealth from HealthService.',
  }

  let controller: CommonController = null;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      controllers: [CommonController],
      providers: [MockHealthServiceProvider],
    }).compile();

    controller = testingModule.get(CommonController);
  });

  it(should.init, async () => {
    expect(controller).not.toBeNull();
    expect(controller).toBeInstanceOf(CommonController);
  });

  it(should.getHealth, async () => {
    const queryArgs = { foo: 'bar', baz: 0 } as any;
    const expectedValue = { foo: 'bar', baz: 0 };
    mockHealthService.getHealth = jest.fn().mockResolvedValue(expectedValue);

    const getHealthSpy = jest.spyOn(mockHealthService, 'getHealth');

    await expect(controller.getHealth(queryArgs)).resolves.toBe(expectedValue);
    expect(getHealthSpy).toHaveBeenCalledWith(queryArgs);
  });
});
