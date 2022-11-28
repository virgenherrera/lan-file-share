import { OnModuleInit } from '@nestjs/common';
import { mimeTypeSource } from '../constants';
import { MimeKind } from '../interfaces';
import { MimeTypesResponse } from '../models/mime-types-response.model';

export class MimeTypesService implements OnModuleInit {
  private _mimeTypesResponse: MimeTypesResponse;

  onModuleInit() {
    this._mimeTypesResponse = mimeTypeSource.reduce((acc, row) => {
      const [, , mimeType] = row;
      const kind = mimeType.split('/').shift() as MimeKind;

      acc[kind].push(mimeType);

      return acc;
    }, new MimeTypesResponse());
  }

  get mimeTypesResponse() {
    return this._mimeTypesResponse;
  }
}
