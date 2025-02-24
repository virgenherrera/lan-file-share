import { Injectable, Logger, PipeTransform } from '@nestjs/common';

@Injectable()
export class WildCardToPathPipe implements PipeTransform {
  private readonly logger = new Logger(this.constructor.name);

  transform(value: string): string {
    this.logger.verbose('transforming:', value);

    return value.replace(/,/g, '/');
  }
}
