import { FolderInfo } from '../../../src/multimedia/models';
import { FileInfoMatcher } from './file-info.matcher';

export const FolderInfoMatcher: Record<keyof FolderInfo, any> = {
  files: expect.arrayContaining([FileInfoMatcher]),
  folders: expect.arrayContaining([expect.any(String)]),
};
