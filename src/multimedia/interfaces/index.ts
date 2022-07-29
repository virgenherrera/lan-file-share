import { Stats } from 'fs';
import { ParsedPath } from 'path';

export type MimeTypeDataRow = [string, string, string];
export type MimeTypeSource = MimeTypeDataRow[];

export type FileInfoArgs = Stats & ParsedPath & { href: string };
