export const getBadRequestMatcher = (...details: string[]) => ({
  statusCode: 400,
  code: 'bad-request-error',
  message: 'Bad Request',
  details,
});

export const getNotFoundMatcher = (...details: string[]) => ({
  statusCode: 404,
  code: 'not-found-error',
  message: 'Not Found',
  details,
});

export const FileDtoMatcher = expect.objectContaining({
  type: 'file',
  fileName: expect.any(String),
  mimeType: expect.any(String),
  path: expect.any(String),
  size: expect.any(String),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
});

export const FolderDtoMatcher = expect.objectContaining({
  type: 'folder',
  name: expect.any(String),
});
