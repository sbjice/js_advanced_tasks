class ComponentError extends Error {
  constructor() {
    super('Элемент не найден на странице');
  }
}

export function wait(ms, valueToReturn = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (ms > 5000) reject('too long');
      resolve(valueToReturn);
    }, ms);
  });
}

export class BaseComponent {
  constructor(selector, showLoader = true, showErrorState = true) {
    if (!document.querySelector(selector)) {
      throw new ComponentError;
    }
    this.selector = document.querySelector(selector);
    this.createSpinner();
    this.showLoader = showLoader;
    this.createErrorList();
    this.showErrorState = showErrorState;
    this.createRetryButton();
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
    else this.hideSpinner()
    try {
      this.loadedData = await this.fetch();
    } catch (error) {
      this.errors = [];
      this.errors.push(error);
    }

    this.fillErrorsList();
    this.hideSpinner();

    return {
      rootElement: this.rootElement,
      loadedData: this.loadedData,
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
    errorsList.classList.add('w-100', 'd-flex', 'flex-column', 'p-0', 'm-0');
    errorsList.style.listStyleType = 'none';
    this.errorsList = errorsList;
  }

  fillErrorsList() {
    if (!this.errors.length) return;
    if(this.showErrorState) {
      this.errors.forEach(item => {
        const errorItem = document.createElement('li');
        errorItem.classList.add('rounded', 'bg-danger', 'd-flex', 'align-items-center', 'p-2');
        errorItem.textContent = item;
        errorItem.style.minHeight = '50px';
        this.errorsList.append(errorItem);
      })
    }
    this.rootElement.append(this.retryButton);
  }

  createRetryButton() {
    const retryButton = document.createElement('a');
    retryButton.classList.add('btn', 'btn-primary', 'w-100');
    retryButton.addEventListener(
      'click',
      async () => {
        this.rootElement.remove();
        this.clearErrorsList();
        await this.getElement();
      }
    );
    retryButton.textContent = 'Попробовать снова';
    this.retryButton = retryButton;
  }

  clearErrorsList() {
    this.errorsList.innerHTML = '';
    this.retryButton.remove();
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
    await wait(6000);
    return {}
  }
}


export class AddToCartComponent extends BaseComponent {
  constructor(selector, showLoader = true, showErrorState = true, timeToWait = 2, valueToReturn = 0) {
    super(selector, showLoader, showErrorState);
    this.timeToWait = timeToWait;
    this.valueToReturn = valueToReturn;
  }

  needUI = false;
  UIDrawn = false;

  async getElement() {

    if (this.rootElement) this.rootElement.innerHTML = '';
    if (this.errorsList) {
      this.clearErrorsList();
      this.errorsList.remove();
      this.errors = [];
    }

    const rootElement = document.createElement('div', 'd-flex', 'flex-column');
    this.rootElement = rootElement;
    this.rootElement.append(this.spinner);
    this.rootElement.append(this.errorsList);
    this.selector.append(this.rootElement);

    if (this.showLoader) this.showSpinner();
    else this.hideSpinner();
    try {
      this.cartValue = await this.fetch();
    } catch (error) {
      this.clearErrorsList();
      this.errors = [];
      this.errors.push(error);
      this.cartValue = 0;
    }

    if (this.cartValue > 0) {
      this.needUI = true;
    }

    this.fillErrorsList();
    this.hideSpinner();
    if (!this.errors.length) {
      this.changeCartUI();
      this.rootElement.append(this.element);
    }

    return {
      rootElement: this.rootElement,
      loadedData: this.loadedData,
    };
  }

  set cartValue(value) {
    if (value < 1) {
      this._cartValue = 0;
      this.needUI = false;
    } else {
      this._cartValue = value;
      this.needUI = true;
    }
  }

  get cartValue() {
    return this._cartValue;
  }

  createStartCartUI() {
    const element = document.createElement('div');
    element.classList.add('w-25', 'd-flex', 'flex-row', 'mb-2');
    element.style.minHeight = '100px';

    const addToCartButton = document.createElement('a');
    addToCartButton.classList.add('btn', 'btn-primary', 'w-100', 'h-100');
    addToCartButton.textContent = 'Добавить в корзину';

    addToCartButton.addEventListener(
      'click',
      () => {
        this.cartValue++;
        this.changeCartUI();
      }
    )

    this.addToCartButton = addToCartButton;
    element.append(addToCartButton);
    if (this.element) {
      this.element.remove();
      this.element.innerHTML = '';
    }

    this.element = element;
    this.rootElement.append(this.element);

    return element;
  }

  createCartUIForValue() {
    const element = document.createElement('div');
    element.classList.add('w-25', 'd-flex', 'flex-row', 'mb-2');
    element.style.minHeight = '10px';

    const decreaseButton = document.createElement('a');
    decreaseButton.classList.add('btn', 'btn-primary', 'align-middle');
    decreaseButton.textContent = '-';
    decreaseButton.style.width = '33%';
    decreaseButton.addEventListener(
      'click',
      () => {
        this.cartValue--;
        this.changeCartUI();
      }
    )

    const increaseButton = document.createElement('a');
    increaseButton.classList.add('btn', 'btn-primary', 'align-middle');
    increaseButton.textContent = '+';
    increaseButton.style.width = '33%';
    increaseButton.addEventListener(
      'click',
      () => {
        this.cartValue++;
        this.changeCartUI();
      }
    )


    const valueText = document.createElement('p');
    valueText.classList.add('m-0', 'lead', 'text-center', 'align-middle');
    valueText.textContent = this.cartValue;
    valueText.style.width = '33%';

    element.append(decreaseButton, valueText, increaseButton);

    if (this.element) {
      this.element.remove();
      this.element.innerHTML = '';
    }

    this.element = element;

    this.decreaseButton = decreaseButton;
    this.increaseButton = increaseButton;
    this.valueText = valueText;
    this.rootElement.append(this.element);

    return element;
  }

  changeCartUI() {
    if (this.cartValue === 0) {
      this.createStartCartUI();
      this.UIDrawn = false;
      return;
    }
    if (this.cartValue > 0) {
      if (!this.needUI) {
        this.createStartCartUI();
        this.UIDrawn = false;
      } else {
        if (!this.UIDrawn) {
          this.createCartUIForValue();
          this.UIDrawn = true;
        }
        this.valueText.textContent = this.cartValue;
      }
    }
  }

  async fetch() {
    return await wait(this.timeToWait * 1000, this.valueToReturn);
  }
}
