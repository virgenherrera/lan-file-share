type CallbackArgs = [Error | null, boolean];
type Callback = (...args: CallbackArgs) => void;

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { BadRequest } from '../../common/exceptions';

function fileFilterFactory(mimeTypes: string[]) {
  return (_req: any, file: Express.Multer.File, callback: Callback) => {
    const argsMap: Record<string, CallbackArgs> = {
      ok: [null, true],
      error: [
        new BadRequest(
          `file: '${file.originalname}' is not an allowed media file.`,
        ),
        false,
      ],
    };
    const args = mimeTypes.includes(file.mimetype) ? argsMap.ok : argsMap.error;

    return callback(...args);
  };
}

export const UploadedFileInterceptor = (mimeTypes: string[]) =>
  FileInterceptor('file', {
    preservePath: true,
    fileFilter: fileFilterFactory(mimeTypes),
  });

export const UploadedFilesInterceptor = (mimeTypes: string[]) =>
  FilesInterceptor('file[]', 50, {
    preservePath: true,
    fileFilter: fileFilterFactory(mimeTypes),
  });
