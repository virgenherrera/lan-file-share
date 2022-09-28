export enum SharedFolderRoute {
  sharedFolder = '/shared-folder', // GET path trough query params
  fileStream = '/shared-folder/file', // GET filePath through params.
  zipFile = '/shared-folder/zip', // POST
}
