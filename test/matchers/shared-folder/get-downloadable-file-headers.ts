export function getDownloadableFileHeaders(filename: string) {
  return {
    'content-type': expect.stringMatching(/.+\/.+;\s.+=.+/),
    'content-disposition': `attachment; filename="${filename}"`,
    'content-length': expect.stringMatching(/^\d+$/),
  };
}
