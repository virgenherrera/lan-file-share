import { ValueProvider } from '@nestjs/common';

import { MimeService } from './mime.service';

export const mockMimeService = {
  getMime: jest.fn(),
  getDescription: jest.fn(),
} as const;

export const MockMimeServiceProvider: ValueProvider = {
  provide: MimeService,
  useValue: mockMimeService,
};
