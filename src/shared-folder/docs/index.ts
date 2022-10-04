import { applyDecorators, StreamableFile } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ZipFilesDto } from '../dto';
import { FolderInfo } from '../models';

export function GetSharedFolderDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a shared folder content.' }),
    ApiQuery({
      type: String,
      name: 'path',
      required: false,
      description: 'Shared folder path to get content.',
    }),
    ApiResponse({
      type: FolderInfo,
      description: `${FolderInfo.name} instance containing data about shared folder files and sub-folders.`,
    }),
  );
}

export function GetFileDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a file to download.' }),
    ApiQuery({
      type: String,
      required: false,
      name: 'path',
      description: 'Path to file to download.',
    }),
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
    ApiBody({
      type: ZipFilesDto,
    }),
    ApiResponse({
      type: StreamableFile,
      description: `${StreamableFile.name} instance file data  to download.`,
    }),
  );
}
