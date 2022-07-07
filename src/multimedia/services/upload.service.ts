import { BadRequest, ServiceUnavailable } from '@core/exceptions';
import { Injectable, Logger } from '@nestjs/common';
import { existsSync, rename, unlink } from 'fs';
import { join } from 'path';
import {
  bindNodeCallback,
  catchError,
  lastValueFrom,
  of,
  switchMap,
  tap,
} from 'rxjs';

@Injectable()
export class UploadService {
  private logger = new Logger(this.constructor.name);

  async singleFile(file: Express.Multer.File) {
    return await lastValueFrom(this.singleFileObservable(file));
  }

  async multipleFiles(...files: Express.Multer.File[]) {
    const filesToUpload = files.map(file => this.singleFile(file));

    return Promise.all(filesToUpload);
  }

  singleFileObservable(file: Express.Multer.File) {
    const destinyFile = join(file.destination, file.originalname);

    return of(existsSync(destinyFile)).pipe(
      switchMap(fileExists =>
        fileExists
          ? this.alreadyExistent(file)
          : this.nonExistingFile(file, destinyFile),
      ),
    );
  }
  private nonExistingFile(file: Express.Multer.File, destinyPath: string) {
    return this.renameFile(file.path, destinyPath).pipe(
      tap(() =>
        this.logger.log(`successfully uploaded file: ${file.originalname}`),
      ),
      switchMap(() => of(destinyPath)),
    );
  }

  private alreadyExistent(file: Express.Multer.File) {
    const errorMessage = `File: '${file.originalname}' already exists.`;

    return this.deleteFile(file.path).pipe(
      switchMap(() => {
        this.logger.log(errorMessage);

        throw new BadRequest([errorMessage]);
      }),
    );
  }

  private renameFile(oldPath: string, newPath: string) {
    const renameObservable = bindNodeCallback(rename);

    return renameObservable(oldPath, newPath).pipe(
      catchError(() => {
        const errorMessage = `file: ${oldPath} renamed to: ${newPath}`;

        this.logger.verbose(errorMessage);

        throw new ServiceUnavailable(errorMessage);
      }),
    );
  }

  private deleteFile(filePath: string) {
    const unlinkObservable = bindNodeCallback(unlink);

    return unlinkObservable(filePath).pipe(
      catchError(() => {
        const errorMessage = `file: ${filePath} deleted`;

        this.logger.verbose(errorMessage);

        throw new ServiceUnavailable(errorMessage);
      }),
    );
  }
}
