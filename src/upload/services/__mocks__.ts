import { ValueProvider } from '@nestjs/common';
import { UploadService } from './upload.service';

type MockUploadService = {
  [K in keyof UploadService]: jest.MockedFunction<UploadService[K]>;
};

export const mockUploadService: MockUploadService = {
  batchCreate: jest.fn(),
  create: jest.fn(),
};

export const MockMockUploadServiceProvider: ValueProvider = {
  provide: UploadService,
  useValue: mockUploadService,
};
