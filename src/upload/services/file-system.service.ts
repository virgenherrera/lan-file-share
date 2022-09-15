import { Injectable, Logger } from '@nestjs/common';
import { createReadStream, existsSync, PathLike } from 'fs';
import { mkdir, readdir, rename, stat, unlink } from 'fs/promises';
import { basename, extname, join, parse, resolve } from 'path';
import { MulterConfig } from '../imports';

@Injectable()
export class FileSystemService {
  private logger = new Logger(this.constructor.name);

  get sharedFolderPath() {
    return this.multerConfig.sharedFolderPath;
  }

  constructor(private multerConfig: MulterConfig) {}

  toUrlPath(...paths: string[]) {
    return this.join(...paths).replace(/\\/g, '/');
  }

  createReadStream(path: PathLike) {
    return createReadStream(path);
  }

  existsSync(path: string) {
    return existsSync(path);
  }

  async mkdir(subPath: string) {
    const path = this.join(this.sharedFolderPath, subPath);

    return mkdir(path, { recursive: true });
  }

  async readdir(path: PathLike) {
    const res = await readdir(path);

    this.logger.verbose(`getting directory content of: ${path}`);

    return res;
  }

  async rename(oldPath: PathLike, newPath: PathLike) {
    await rename(oldPath, newPath);

    this.logger.verbose(`file: ${oldPath} renamed to: ${newPath}`);
  }

  async stat(path: PathLike) {
    const res = await stat(path);

    this.logger.verbose(`getting file stats for: ${path}`);

    return res;
  }

  async unlink(filePath: PathLike) {
    await unlink(filePath);

    this.logger.verbose(`file: ${filePath} deleted`);
  }

  basename(path: string) {
    return basename(path);
  }

  extname(path: string) {
    return extname(path);
  }

  join(...paths: string[]) {
    return join(...paths);
  }

  resolve(...paths: string[]) {
    return resolve(...paths);
  }

  parse(path: string) {
    return parse(path);
  }
}
