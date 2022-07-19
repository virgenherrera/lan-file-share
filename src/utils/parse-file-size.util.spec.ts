import { parseFileSize } from './parse-file-size.util';

describe(`UT:${parseFileSize.name}`, () => {
  it('Should not Throw', () => {
    expect(parseFileSize).not.toThrow();
  });

  it('Should return the correct value', () => {
    expect(parseFileSize(1024)).toBe('1.00 KB');
  });

  it('Should return the correct value', () => {
    expect(parseFileSize(1025 * 1024)).toBe('1.00 MB');
  });

  it('Should return the correct value', () => {
    expect(parseFileSize(1025 * 1024 * 1024)).toBe('1.00 GB');
  });

  it('Should return the correct value', () => {
    expect(parseFileSize(1025 * 1024 * 1024 * 1024)).toBe('1.00 TB');
  });
});
