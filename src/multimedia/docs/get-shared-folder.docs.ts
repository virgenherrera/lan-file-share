import { applyDecorators } from '@nestjs/common';
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
