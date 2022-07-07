import { BadRequest } from '@core/exceptions';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaMimeTypes } from '../constants';

export const MediaInterceptor = FileInterceptor('file', {
  preservePath: true,
  fileFilter: (_req, file, cb) => {
    const argsMap: Record<string, [Error | null, boolean]> = {
      ok: [null, true],
      error: [
        new BadRequest([
          `file: '${file.originalname}' is not an allowed media file.`,
        ]),
        false,
      ],
    };
    const args = MediaMimeTypes.includes(file.mimetype)
      ? argsMap.ok
      : argsMap.error;

    return cb.apply(this, args);
  },
});
