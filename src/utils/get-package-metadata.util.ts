import { readFileSync } from 'fs';
import { join, resolve } from 'path';

export function getPackageMetadata() {
  const path = resolve(join(process.cwd(), './package.json'));
  const packageJson = JSON.parse(
    readFileSync(path, {
      encoding: 'utf8',
      flag: 'r',
    }),
  );
  const name: string = packageJson.name;
  const version: string = packageJson.version;
  const description: string = packageJson.description;
  const author: string = packageJson.author;
  const license: string = packageJson.license;

  return {
    name,
    version,
    description,
    author,
    license,
  };
}
