import { Injectable, Logger } from '@nestjs/common';
import { MulterModule, MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { mkdir } from 'fs/promises';
import { SHARED_FOLDER_PATH } from '../constants';

@Injectable()
export class MulterConfigModule implements MulterOptionsFactory {
  static registerAsync() {
    return MulterModule.registerAsync({
      useClass: MulterConfigModule,
    });
  }

  private logger = new Logger(this.constructor.name);

  async createMulterOptions(): Promise<MulterOptions> {
    this.logger.log(`Creating multer options...`);

    const dest = SHARED_FOLDER_PATH;

    await mkdir(dest, { recursive: true });

    this.logger.log(`Storing files in: ${dest}`);

    return { dest };
  }
}
