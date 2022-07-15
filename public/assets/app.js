'use strict';

// function LoadScript(src) {
//   return new Promise((onload, onerror) => {
//     const script = document.createElement('script');

//     Object.assign(script, {
//       id: `script-${src}`,
//       async: true,
//       onload,
//       onerror,
//       src,
//     });

//     document.body.appendChild(script);
//   });
// }

document.addEventListener('DOMContentLoaded', async () => {
  // const scripts = [
  //   '/assets/services/backend.service.js',
  //   '/assets/services/dom-manipulation.service.js',
  //   '/assets/controllers/app.controller.js',
  // ];
  // const scriptPromises = scripts.map(script => LoadScript(script));
  // await Promise.all(scriptPromises);

  const app = new AppController();

  app.bootstrap();
});

class AppController {
  backendService = new BackendService();
  domManipulationService = new DomManipulationService();

  async bootstrap() {
    await this.setAcceptMimeTypes();
    await this.publishEvenListeners();
  }

  async setAcceptMimeTypes() {
    const mimeTypes = await this.backendService.getMimeTypes();

    this.domManipulationService.setInputAccept(mimeTypes.join(', '));
  }

  async publishEvenListeners() {
    this.domManipulationService.setButtonListeners();
    this.domManipulationService.element
      .getInputFileForm()
      .addEventListener('file-upload', this.fileUpload.bind(this));
  }

  async fileUpload(event) {
    const { file } = event.detail;

    this.backendService
      .postFile(file)
      .then(this.fileUploadSuccess.bind(this))
      .catch(this.postFileError.bind(this));
  }

  async fileUploadSuccess() {
    this.domManipulationService.hideFileModal();

    console.log('fake refresh file  list');
  }

  async postFileError(error) {
    const [errorMessage] = error.response.details;

    this.domManipulationService.toggleFileUploadForm();
    this.domManipulationService.clearFileInputs();
    this.domManipulationService.setFileError(errorMessage);
  }
}

class BackendService {
  apiUrl = `/api/v1/`;
  endpoint = {
    file: `${this.apiUrl}multimedia/file`,
    mimeTypes: `${this.apiUrl}multimedia/mime-types`,
  };

  async getMimeTypes() {
    const response = await fetch(this.endpoint.mimeTypes);
    const { data } = await response.json();

    return data;
  }

  async postFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(this.endpoint.file, {
      method: 'POST',
      body: formData,
    });

    return this.responseHandler(response);
  }

  async responseHandler(response) {
    if (!response.ok) {
      const error = new Error('HTTP status code: ' + response.status);

      error.status = response.status;
      error.response = await response.json();

      throw error;
    }

    return response.json();
  }
}

class DomManipulationService {
  selector = {
    uploadFileButton: '#upload-file-button',
    uploadFileModal: '#upload-file-modal',
    fileProgress: '#upload-progress',
    inputFileForm: '#input-file-form',
    inputFile: '#input-file',
    inputFileValidation: '#input-file-validation',
    fileUploadButton: '#file-upload-button',
    modalDismissButtons: '[data-bs-dismiss="modal"]',
  };
  element = {
    getUploadFileButton: () =>
      document.querySelector(this.selector.uploadFileButton),
    getUploadFileModal: () =>
      document.querySelector(this.selector.uploadFileModal),
    getFileProgress: () => document.querySelector(this.selector.fileProgress),
    getInputFileForm: () => document.querySelector(this.selector.inputFileForm),
    getInputFile: () => document.querySelector(this.selector.inputFile),
    getInputFileValidation: () =>
      document.querySelector(this.selector.inputFileValidation),
    getFileUploadButton: () =>
      document.querySelector(this.selector.fileUploadButton),
    getModalDismissButtons: () =>
      Array.from(document.querySelectorAll(this.selector.modalDismissButtons)),
  };

  setInputAccept(mimeTypesString) {
    const inputFile = this.element.getInputFile();

    inputFile.setAttribute('accept', mimeTypesString);

    inputFile.addEventListener('change', () => {
      this.element.getFileUploadButton().classList.remove('disabled');
      this.setFileError();
    });
  }

  setButtonListeners() {
    const fileUploadButton = this.element.getFileUploadButton();

    fileUploadButton.addEventListener('click', () => {
      fileUploadButton.classList.add('disabled');

      this.toggleFileUploadForm();
      this.dispatchFileUpload();
    });

    this.element.getModalDismissButtons().map(element => {
      element.addEventListener('click', this.clearFileInputs.bind(this));
    });
  }

  toggleFileUploadForm() {
    const cssClass = 'd-none';
    const inputFileForm = this.element.getInputFileForm();
    const fileProgress = this.element.getFileProgress();

    if (inputFileForm.classList.contains(cssClass)) {
      inputFileForm.classList.remove(cssClass);
      fileProgress.classList.add(cssClass);
    } else {
      inputFileForm.classList.add(cssClass);
      fileProgress.classList.remove(cssClass);
    }
  }

  dispatchFileUpload() {
    const [file] = this.element.getInputFile().files;
    const fileUploadEvent = new CustomEvent('file-upload', {
      detail: {
        file,
      },
    });

    this.element.getInputFileForm().dispatchEvent(fileUploadEvent);
  }

  hideFileModal() {
    this.toggleFileUploadForm();
    const uploadFileModal = this.element.getUploadFileModal();
    const modalInstance = bootstrap.Modal.getInstance(uploadFileModal);

    modalInstance.hide();
    this.clearFileInputs();
  }

  clearFileInputs() {
    this.element.getInputFile().value = '';
    this.setFileError();
  }

  setFileError(errorString = '') {
    const inputFile = this.element.getInputFile();
    const inputFileValidation = this.element.getInputFileValidation();

    if (errorString) {
      inputFile.classList.add('is-invalid');
      inputFileValidation.innerText = errorString;
    } else {
      inputFile.classList.remove('is-invalid');
      inputFileValidation.innerText = errorString;
    }
  }
}
