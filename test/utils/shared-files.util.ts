import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import * as rimraf from 'rimraf';
import { MulterConfig } from '../../src/multimedia/modules';
import { TestContext } from './test-context.util';

export const mockSharedFiles: Record<'filename' | 'content', string>[] = [
  {
    filename: 'file-01.txt',
    content: 'file-01 content',
  },
  {
    filename: 'file-02.txt',
    content: 'file-02 content',
  },
  {
    filename: 'file-03.txt',
    content: 'file-03 content',
  },
  { filename: 'file-04.txt', content: 'file-4 content' },
];

export const mockSharedNestedFolders = ['nested-01', 'nested-02', 'nested-03'];

export async function initSharedFiles(testCtx: TestContext) {
  const { sharedFolderPath } = testCtx.app.get(MulterConfig);
  const paths = [
    sharedFolderPath,
    ...mockSharedNestedFolders.map(p => join(sharedFolderPath, p)),
  ];

  for await (const path of paths) {
    await createFiles(path);
  }
}

export function dropSharedFiles(testCtx: TestContext) {
  return new Promise((Resolve, Reject) => {
    const { sharedFolderPath } = testCtx.app.get(MulterConfig);

    return rimraf(sharedFolderPath, { maxBusyTries: 10 }, err =>
      !err ? Resolve(null) : Reject(err),
    );
  });
}

async function createFiles(path: string) {
  await mkdir(path, { recursive: true });

  for await (const { filename, content } of mockSharedFiles) {
    const filePath = join(path, filename);

    if (!existsSync(filePath)) {
      await writeFile(filePath, content, {
        encoding: 'utf8',
      });
    }
  }
}
