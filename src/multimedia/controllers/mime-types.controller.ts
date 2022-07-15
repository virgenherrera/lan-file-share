import { Controller, Get } from '@nestjs/common';
import { MediaMimeTypes } from '../constants';
import { MultimediaRoute } from '../enums';

@Controller()
export class MimeTypesController {
  @Get(MultimediaRoute.mimeTypes)
  async getMimeTypes() {
    return { data: MediaMimeTypes };
  }
}
