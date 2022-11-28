import { readJsonFile } from '../../utils/read-json-file';
import { MimeTypeSource } from '../interfaces';

export const mimeTypeSource = readJsonFile<MimeTypeSource>(
  process.cwd(),
  'config/allowed-mime-types.json',
);
