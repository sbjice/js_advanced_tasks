class ComponentError extends Error {
  constructor() {
    super('Элемент не найден на странице');
  }
}

function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (ms > 5000) reject('too long');
      resolve();
    }, ms);
  });
}

export default class BaseComponent {
  constructor(selector, showLoader = true, showErrorState = true) {
    if (!document.querySelector(selector)) {
      throw new ComponentError;
    }
    this.selector = document.querySelector(selector);
    this.createSpinner();
    this.showLoader = showLoader;
    this.createErrorList();
    this.showErrorState = showErrorState;
  }

  errors = [];
  isLoaded = false;
  loadedData = null;

  async getElement() {
    const rootElement = document.createElement('div', 'd-flex', 'flex-column');
    this.rootElement = rootElement;
    this.rootElement.append(this.spinner);
    this.rootElement.append(this.errorsList);
    this.selector.append(this.rootElement);

    if (this.showLoader) this.showSpinner();
    try {
      this.loadedData = await this.fetch();
    } catch (error) {
      this.errors.push(error);
    }

    if (this.showErrorState) this.fillErrorsList();
    this.hideSpinner();
    self = this;

    return {
      rootElement: this.rootElement,
      loadedData: self.loadedData,
    };
  }

  createSpinner() {
    const spinnerContainer = document.createElement('div');
    spinnerContainer.classList.add('d-flex', 'justify-content-center', 'spinner', 'my-3');
    const spinner = document.createElement('div');
    spinner.classList.add('spinner-border');
    spinner.setAttribute('role', 'status');
    const spinnerSpan = document.createElement('span');
    spinnerSpan.classList.add('sr-only');
    spinner.append(spinnerSpan);
    spinnerContainer.append(spinner);
    this.spinner = spinnerContainer;
  }

  showSpinner() {
    this.spinner.classList.remove('d-none');
    this.spinner.classList.add('d-flex');
  }

  hideSpinner() {
    this.spinner.classList.remove('d-flex');
    this.spinner.classList.add('d-none');
  }

  createErrorList() {
    const errorsList = document.createElement('ul');
    errorsList.classList.add('w-100', 'd-flex', 'flex-column', 'p-0');
    errorsList.style.listStyleType = 'none';
    this.errorsList = errorsList;
  }

  fillErrorsList() {
    if (!this.errors.length) return;
    this.errors.forEach(item => {
      const errorItem = document.createElement('li');
      errorItem.classList.add('rounded', 'bg-danger', 'd-flex', 'align-items-center', 'p-2');
      errorItem.textContent = item;
      errorItem.style.minHeight = '50px';
      this.errorsList.append(errorItem);
    })
  }

  clearErrorsList() {
    this.errorsList.innerHTML = '';
  }

  showErrorsList() {
    this.errorsList.classList.remove('d-none');
    this.errorsList.classList.add('d-flex');
  }

  hideErrorsList() {
    this.errorsList.classList.remove('d-flex');
    this.errorsList.classList.add('d-none');
  }

  async fetch() {
    await wait(3000);
    return {}
  }
}
