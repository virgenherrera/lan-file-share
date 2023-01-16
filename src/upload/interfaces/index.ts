import { MimeKinds } from '../constants';

export type MulterFile = Express.Multer.File;
export type FileWithDestinationPath = MulterFile & { destinationPath: string };
export type MimeTypeDataRow = [string, string, string];
export type MimeTypeSource = MimeTypeDataRow[];
export type MimeKind = (typeof MimeKinds)[number];
