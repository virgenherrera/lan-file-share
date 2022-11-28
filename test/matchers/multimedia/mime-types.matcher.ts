import { MimeKind } from '../../../src/upload/interfaces';

export const GetMimeTypesArrayMatcher = expect.arrayContaining([
  expect.stringMatching(/.+\/.+/),
]);

export const GetMimeTypesMatcher: Record<MimeKind, any> = {
  application: GetMimeTypesArrayMatcher,
  audio: GetMimeTypesArrayMatcher,
  font: GetMimeTypesArrayMatcher,
  image: GetMimeTypesArrayMatcher,
  text: GetMimeTypesArrayMatcher,
  video: GetMimeTypesArrayMatcher,
};
