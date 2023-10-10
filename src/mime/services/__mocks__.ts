import { ValueProvider } from '@nestjs/common';

import { MimeService } from './mime.service';

type MockedMimeService = {
  [K in keyof MimeService]: jest.MockedFunction<MimeService[K]>;
};

export const mockMimeService: MockedMimeService = {
  getMime: jest.fn(),
  getDescription: jest.fn(),
};

export const MockMimeServiceProvider: ValueProvider = {
  provide: MimeService,
  useValue: mockMimeService,
};
