import { ValueProvider } from '@nestjs/common';
import { UploadService } from './upload.service';

export const mockUploadService = {
  batchCreate: jest.fn(),
  create: jest.fn(),
} as const;

export const MockMockUploadServiceProvider: ValueProvider = {
  provide: UploadService,
  useValue: mockUploadService,
};
