import AdmZip from 'adm-zip';
import { DownloadableFile } from './downloadable-file.model';

export class DownloadableZipFile extends DownloadableFile {
  constructor(fileName: string, zip: AdmZip) {
    const memoryZipBuffer = zip.toBuffer();
    const intArray = new Uint8Array(memoryZipBuffer);

    super(fileName, 'application/zip', intArray as any, intArray.byteLength);
  }
}
