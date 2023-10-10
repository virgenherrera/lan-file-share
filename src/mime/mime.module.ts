import { Module, Provider } from '@nestjs/common';
import { MimeService } from './services';

@Module({
  providers: MimeModule.providers,
  exports: MimeModule.providers,
})
export class MimeModule {
  static providers: Provider[] = [MimeService];
}
