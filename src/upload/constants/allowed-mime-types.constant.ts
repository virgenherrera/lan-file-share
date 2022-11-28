import { mimeTypeSource } from './mime-type-source.constant';

export const AllowedMimeTypes = mimeTypeSource.map(row => row[2]);
