export function parseFileSize(size: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;

  while (size >= 1024) {
    size /= 1024;
    i++;
  }

  return `${Math.round(size * 100) / 100} ${units[i]}`;
}
