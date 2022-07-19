import { homedir } from 'os';
import { join } from 'path';
import { getPackageMetadata } from '../../utils';

export * from './media-mime-types.constant';

export const SHARED_FOLDER_PATH = join(
  homedir(),
  'Downloads',
  getPackageMetadata().name,
);
