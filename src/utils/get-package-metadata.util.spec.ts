import { getPackageMetadata } from './get-package-metadata.util';

describe('UT:getPackageMetadata', () => {
  it('Should not Throw', () => {
    expect(getPackageMetadata).not.toThrow();
  });
});
