import { readJsonFile } from '../../utils/read-json-file';
import { MimeTypeSource } from '../interfaces';

export const mimeTypeSource = readJsonFile<MimeTypeSource>(
  __dirname,
  '../../../',
  'config/allowed-mime-types.json',
);
