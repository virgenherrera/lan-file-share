import { applyDecorators, StreamableFile } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FolderInfo } from '../models';

export function GetSharedFolderDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a shared folder content.' }),
    ApiResponse({
      type: FolderInfo,
      description: `${FolderInfo.name} instance containing data about shared folder files and sub-folders.`,
    }),
  );
}

export function GetFileDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a file to download.' }),
    ApiResponse({
      type: StreamableFile,
      description: `${StreamableFile.name} instance file data  to download.`,
    }),
  );
}

export function GetZipFileDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a file containing requested files compressed to download.',
    }),
    ApiResponse({
      type: StreamableFile,
      description: `${StreamableFile.name} instance file data  to download.`,
    }),
  );
}
