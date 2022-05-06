import { BaseComponent, wait} from "./index.js";

export class AddToCartComponent extends BaseComponent {
  constructor(selector, showLoader = true, showErrorState = true) {
    super(selector, showLoader = true, showErrorState = true)
  }

  async getElement() {
    const rootElement = document.createElement('div', 'd-flex', 'flex-column');
    this.rootElement = rootElement;
    this.rootElement.append(this.spinner);
    this.rootElement.append(this.errorsList);
    this.selector.append(this.rootElement);

    if (this.showLoader) this.showSpinner();
    try {
      this.cartValue = await this.fetch();
    } catch (error) {
      this.errors = [];
      this.errors.push(error);
      this.cartValue = 0;
    }

    if (this.cartValue > 0) {
      this.needUI = true;
    }

    if (this.showErrorState) this.fillErrorsList();
    this.hideSpinner();
    this.changeCartUI();
    this.rootElement.append(this.element);

    return {
      rootElement: this.rootElement,
      loadedData: this.loadedData,
    };
  }

  needUI = false;

  set cartValue(value) {
    if (value < 1) {
      this._cartValue = 0;
      this.needUI = false;
    }
    else {
      this._cartValue = value;
      this.needUI = true;
    }
  }

  get cartValue() {
    return this._cartValue;
  }

  createStartCartUI() {
    const element = document.createElement('div');
    element.classList.add('w-25', 'd-flex', 'flex-row');
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
    element.classList.add('w-25', 'd-flex', 'flex-row');
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
    valueText.classList.add('m-0','lead', 'text-center', 'align-middle');
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
    if (this.cartValue == 0) {
      this.createStartCartUI();
      return;
    }
    if (this.cartValue > 0) {
      if (!this.needUI) {
        this.createStartCartUI();
      } else {
        this.createCartUIForValue();
        this.valueText.textContent = this.cartValue;
      }
    }
  }


  async fetch() {
    await wait(2000);
    return 2;
  }
}
