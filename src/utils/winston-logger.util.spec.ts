import { CreateWinstonLogger } from './winston-logger.util';

describe('UT:CreateWinstonLogger', () => {
  it('Should not throw', () => {
    expect(CreateWinstonLogger).not.toThrow();
  });
});
