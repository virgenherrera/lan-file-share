import { Logger, Provider } from '@nestjs/common';

export const mockLogger: Record<keyof Logger, any> = {
  log: () => this,
  error: () => this,
  warn: () => this,
  debug: () => this,
  verbose: () => this,
  localInstance: () => this,
};

export const MockLoggerProvider: Provider = {
  provide: Logger,
  useValue: mockLogger,
};
