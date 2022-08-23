import { FileInfo, FolderInfo } from '../../../src/multimedia/models';

export const FileInfoMatcher: Record<keyof FileInfo, any> = {
  fileName: expect.any(String),
  href: expect.any(String),
  size: expect.any(String),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
};

export const FolderInfoMatcher: Record<keyof FolderInfo, any> = {
  files: expect.arrayContaining([FileInfoMatcher]),
  folders: expect.arrayContaining([expect.any(String)]),
};
