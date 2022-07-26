export function parseFileSize(size: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let idx = 0;

  while (size >= 1024) {
    size /= 1024;
    idx++;
  }

  const roundedSize = Math.round(size * 100) / 100;
  const fixedSize = roundedSize.toFixed(2);

  return `${fixedSize} ${units[idx]}`;
}
