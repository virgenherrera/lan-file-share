import { Injectable, Logger } from '@nestjs/common';
import { MulterModule, MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { mkdir } from 'fs/promises';
import { homedir } from 'os';
import { join, resolve } from 'path';
import { CoreModule } from '../../core/core.module';
import { EnvConfigService } from '../../core/services';
import { getPackageMetadata } from '../../utils';

@Injectable()
export class MulterConfig implements MulterOptionsFactory {
  static registerAsync() {
    return MulterModule.registerAsync({
      imports: [CoreModule],
      useClass: MulterConfig,
      inject: [EnvConfigService],
    });
  }

  constructor(private envConfigService: EnvConfigService) {}

  private logger = new Logger(this.constructor.name);

  get sharedFolderPath(): string {
    const defaultValue = join(
      homedir(),
      'Downloads',
      getPackageMetadata().name,
    );
    const SHARED_FOLDER_PATH = this.envConfigService.get(
      'SHARED_FOLDER_PATH',
      defaultValue,
    );
    const sharedFolderPath = resolve(SHARED_FOLDER_PATH);

    return sharedFolderPath;
  }

  async createMulterOptions(): Promise<MulterOptions> {
    this.logger.log(`Creating multer options...`);

    const { sharedFolderPath } = this;

    await mkdir(sharedFolderPath, { recursive: true });

    this.logger.log(`Storing files in: '${sharedFolderPath}'`);

    return { dest: sharedFolderPath };
  }
}
