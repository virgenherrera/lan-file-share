import { Injectable, Logger } from '@nestjs/common';
import { MulterModule, MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { mkdir } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';
import { getPackageMetadata } from '../../utils';

@Injectable()
export class MulterConfig implements MulterOptionsFactory {
  static registerAsync() {
    return MulterModule.registerAsync({
      useClass: MulterConfig,
    });
  }

  private logger = new Logger(this.constructor.name);

  readonly sharedFolderPath = join(
    homedir(),
    'Downloads',
    getPackageMetadata().name,
  );

  async createMulterOptions(): Promise<MulterOptions> {
    this.logger.log(`Creating multer options...`);

    const { sharedFolderPath } = this;

    await mkdir(sharedFolderPath, { recursive: true });

    this.logger.log(`Storing files in: ${sharedFolderPath}`);

    return { dest: sharedFolderPath };
  }
}
