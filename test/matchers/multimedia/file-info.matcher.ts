import { FileInfo } from '../../../src/multimedia/models';

export const FileInfoMatcher: Record<keyof FileInfo, any> = {
  fileName: expect.any(String),
  href: expect.any(String),
  size: expect.any(String),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
};
