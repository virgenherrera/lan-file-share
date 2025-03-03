import { applyDecorators, Get } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';

import { PagedResults } from '../../application/dto';
import { HttpExceptionFilter } from '../../application/filters';
import { FileDto, FolderDto } from '../dto';

export function GetSharedFolderDocs() {
  return applyDecorators(
    Get(),
    ApiOperation({
      description:
        'Get folder content defined by path queryParams with pagination.',
    }),
    ...HttpExceptionFilter.getDocs(),
    ApiExtraModels(PagedResults, FileDto, FolderDto),
    ApiOkResponse({
      description: `${PagedResults.name} object containing data about shared folder files and sub-folders.`,
      schema: {
        allOf: [{ $ref: getSchemaPath(PagedResults) }],
        properties: {
          rows: {
            type: 'array',
            items: {
              oneOf: [
                { $ref: getSchemaPath(FileDto) },
                { $ref: getSchemaPath(FolderDto) },
              ],
            },
          },
        },
      },
    }),
  );
}
