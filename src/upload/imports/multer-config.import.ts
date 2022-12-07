import { Injectable, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule, MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { mkdir } from 'fs/promises';
import { homedir } from 'os';
import { join, resolve } from 'path';
import { CommonModule } from '../../common/common.module';
import { getPackageMetadata } from '../../utils';

@Injectable()
export class MulterConfig implements MulterOptionsFactory {
  static registerAsync() {
    return MulterModule.registerAsync({
      imports: [ConfigModule, CommonModule],
      useClass: MulterConfig,
      inject: [ConfigService],
    });
  }

  private logger = new Logger(this.constructor.name);
  private _sharedFolderPath: string;

  constructor(private configService: ConfigService) {
    this.setSharedFolderPath();
  }

  private setSharedFolderPath() {
    const { name } = getPackageMetadata();
    const defaultValue = join(homedir(), 'Downloads', name);
    const SHARED_FOLDER_PATH = this.configService.get(
      'SHARED_FOLDER_PATH',
      defaultValue,
    );

    this._sharedFolderPath = resolve(SHARED_FOLDER_PATH);
  }

  get sharedFolderPath(): string {
    return this._sharedFolderPath;
  }

  async createMulterOptions(): Promise<MulterOptions> {
    this.logger.log(`Creating multer options...`);

    const { sharedFolderPath } = this;

    await mkdir(sharedFolderPath, { recursive: true });

    this.logger.log(`Storing files in: '${sharedFolderPath}'`);

    return { dest: sharedFolderPath };
  }
}
