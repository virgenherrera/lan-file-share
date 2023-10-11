import { Injectable } from '@nestjs/common';

import { Logger } from '../../common/decorators';
import { NotFound } from '../../common/exceptions';
import { readJsonFile } from '../../utils';

@Injectable()
export class MimeService {
  @Logger() private logger: Logger;
  private readonly mimeTypesMap = new Map(
    readJsonFile<[string, string, string][]>(
      __dirname,
      '../../../',
      'config/allowed-mime-types.json',
    ).map(([extension, description, mimeType]) => [
      extension,
      { description, mimeType },
    ]),
  );

  getMime(extension: string): string {
    this.logger.log(`looking MIME type for extension ${extension}`);

    const element = this.mimeTypesMap.get(extension);

    return !element
      ? this.errorHandler(
          new NotFound(`MIME type not found for extension: ${extension}`),
        )
      : element.mimeType;
  }

  getDescription(extension: string): string {
    this.logger.log(`looking description for extension ${extension}`);

    const element = this.mimeTypesMap.get(extension);

    return !element
      ? this.errorHandler(
          new NotFound(`Description not found for extension: ${extension}`),
        )
      : element.description;
  }

  private errorHandler(error: Error): never {
    this.logger.error(error.message, error.stack);

    throw error;
  }
}
