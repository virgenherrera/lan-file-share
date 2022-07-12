import { CoreModule } from '@core/core.module';
import { EnvConfigService } from '@core/services';
import { Injectable, Logger } from '@nestjs/common';
import { MulterModule, MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { getPackageMetadata } from '@utils';
import { mkdirSync } from 'fs';
import { mkdir } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';

@Injectable()
export class MulterConfigModule implements MulterOptionsFactory {
  static registerAsync() {
    return MulterModule.registerAsync({
      imports: [CoreModule],
      useClass: MulterConfigModule,
    });
  }

  private defaultDestiny = `Downloads/${getPackageMetadata().name}`;
  private logger = new Logger(this.constructor.name);

  constructor(private envConfigService: EnvConfigService) {}

  async createMulterOptions(): Promise<MulterOptions> {
    this.logger.log(`Creating multer options...`);

    const APP_UPLOAD_PATH = this.envConfigService.get(
      'APP_UPLOAD_PATH',
      this.defaultDestiny,
    );
    const userHomePath = homedir();
    const dest = join(userHomePath, APP_UPLOAD_PATH);

    await mkdir(dest, { recursive: true });

    mkdirSync(dest, { recursive: true });

    this.logger.log(`Storing files in: ${dest}`);

    return { dest };
  }
}
