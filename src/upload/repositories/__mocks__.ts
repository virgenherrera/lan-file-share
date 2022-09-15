import { ValueProvider } from '@nestjs/common';
import { UploadRepository } from './upload.repository';

export const mockUploadRepository: Record<keyof UploadRepository, any> = {
  batchCreate: jest.fn(),
  create: jest.fn(),
};

export const UploadRepositoryProvider: ValueProvider = {
  provide: UploadRepository,
  useValue: mockUploadRepository,
};
