// import 'babel-loader';

import {
  el,
  mount
} from 'redom';
import Inputmask from 'inputmask';

let valid = require('card-validator');

const cssPromises = {};

function loadResourses(src) {
  if (src.endsWith('.js')) {
    return import(src);
  }
  if (src.endsWith('.css')) {
    if (!cssPromises[src]) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = src;
      cssPromises[src] = new Promise(resolve => {
        link.addEventListener('load', () => resolve());
      });
      document.head.append(link);
    }
    return cssPromises[src];
  }
  return fetch(src).then(res => res.json());
}

const resources = [
  'https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css'
];

resources.forEach(loadResourses);

Promise.all(Object.keys(cssPromises));

export class CreditCard {
  constructor() {
    document.body.classList.add('h-100');
    document.documentElement.classList.add('h-100');
    this.createComponentContainer();
    this.createFormContainer();
    this.createFormElements();

    this.createImageContainer();
    this.createImage();

    this.configCardNumberInput();
    this.configDateInput();
    this.configEmailInput();
    this.configCVVNumberInput();

    mount(document.body, this.container);
    mount(this.container, this.formContainer);
    mount(this.container, this.imageContainer);

    mount(this.formContainer, this.cardNumber);
    mount(this.formContainer, this.dateInput);
    mount(this.formContainer, this.emailInput);
    mount(this.formContainer, this.cvvNumber);
    mount(this.imageContainer, this.image);

    mount(document.body, el('div.container.p-0',this.sumbitButton));
  }

  dateValid = false;
  cardValid = false;
  cvvValid = false;
  emailValid = false;
  re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  createComponentContainer() {
    const container = el('div.container.mt-5.mb-2.p-0.d-flex.flex-row.credit-card-component.mh-100');
    this.container = container;
  }

  createFormContainer() {
    const formContainer = el('div.p-0.d-flex.flex-column.w-100');
    this.formContainer = formContainer;
  }

  createFormElements() {
    const cardNumber = el('input.form-control.w-100.mb-2', {
      type: 'text',
    });
    const cardWrapper = new Inputmask({
      mask: '9999 9999 9999 9999',
      placeholder: '0'
    });
    cardWrapper.mask(cardNumber);
    this.cardNumber = cardNumber;
    this.cardWrapper = cardWrapper;

    const dateInput = el('input.form-control.w-100.mb-2', {
      type: 'text'
    });
    const dateWrapper = new Inputmask({
      mask: '99/99',
      placeholder: '0'
    });
    dateWrapper.mask(dateInput);
    this.dateInput = dateInput;
    this.dateWrapper = dateWrapper;

    const cvvNumber = el('input.form-control.w-100', {
      type: 'text',
      // placeholder: 'CVV'
    });
    const cvvWrapper = new Inputmask({
      mask: '999',
      placeholder: ''
    });
    cvvWrapper.mask(cvvNumber);
    this.cvvNumber = cvvNumber;
    this.cvvWrapper = cvvWrapper;

    const emailInput = el('input.form-control.w-100.mb-2', {
      type: 'text',
      placeholder: 'Email'
    });
    const emailWrapper = new Inputmask({
      mask: '*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]'
    })
    this.emailInput = emailInput;
    this.emailWrapper = emailWrapper;

    const sumbitButton = el('button.btn.btn-primary.w-100', {
      textContent: 'Отправить',
      disabled: true
    });
    this.sumbitButton = sumbitButton;
  }

  configCardNumberInput() {
    this.cardNumber.addEventListener(
      'blur',
      () => {
        this.cardValid = false;
        const card = this.cardNumber.value.split(' ').join('');
        const numberValidation = valid.number(card);
        if (!numberValidation.isValid) {
          this.cardNumber.classList.add('border-danger');
          this.activateSubmitButton();
          return;
        }
        console.log(numberValidation);

        if (numberValidation.card.type === 'visa') this.image.src = require('./assets/visa.png');
        else if (numberValidation.card.type === 'mastercard') this.image.src = require('./assets/mastercard.png');
        else this.image.src = require('./icon.png');
        this.image.classList.remove('d-none');
        this.image.classList.add('d-inline-flex');
        this.cardValid = true;
        this.activateSubmitButton();
      }
    );

    this.cardNumber.addEventListener(
      'input',
      () => {
        this.cardNumber.classList.remove('border-danger');
      }
    );
  }

  configDateInput() {
    this.dateInput.addEventListener(
      'blur',
      () => {
        this.dateValid = false;
        const dateNow = new Date();
        const monthNow = dateNow.getMonth();
        const yearNow = dateNow.getFullYear();

        const [month, year] = this.dateInput.value.split('/').map(Number);
        if ((yearNow % 100) > year ||
          monthNow > month ||
          month > 12) {
          this.dateInput.classList.add('border-danger');
          this.activateSubmitButton();
          return;
        }
        this.dateValid = true;
        this.activateSubmitButton();
      }
    );

    this.dateInput.addEventListener(
      'input',
      () => {
        this.dateInput.classList.remove('border-danger');
        const [month, year] = this.dateInput.value.split('/').map(Number);
        if (month > 12) this.dateInput.value = `12/${year}`;
      }
    );
  }

  configEmailInput() {
    this.emailInput.addEventListener(
      'blur',
      () => {
        this.emailValid = false;
        if (!this.emailInput.value.match(this.re)) {
          this.emailInput.classList.add('border-danger');
          this.activateSubmitButton();
          return;
        }
        this.emailValid = true;
        this.activateSubmitButton();
      }
    );

    this.emailInput.addEventListener(
      'input',
      () => {
        this.emailInput.classList.remove('border-danger');
      }
    );
  }

  configCVVNumberInput() {
    this.cvvNumber.addEventListener(
      'blur',
      () => {
        this.cvvValid = false;
        if (this.cvvNumber.value.length < 3) {
          this.cvvNumber.classList.add('border-danger');
          this.activateSubmitButton();
          return;
        }
        this.cvvValid = true;
        this.activateSubmitButton();
      }
    );

    this.cvvNumber.addEventListener(
      'input',
      () => {
        this.cvvNumber.classList.remove('border-danger');
      }
    )
  }

  createImageContainer(){
    const imageContainer = el('div.p-0.d-flex.flex-column');
    this.imageContainer = imageContainer;
  }

  createImage() {
    const image = el('img.d-none.w-100',{alt: 'Картинка платежной системы', style: {maxWidth: 'none', height: '184px'}});
    this.image = image;
  }

  activateSubmitButton() {
    console.log(this.cardValid, this.dateValid, this.emailValid, this.cvvValid);
    this.sumbitButton.disabled = !(this.cardValid && this.dateValid && this.emailValid && this.cvvValid);
  }
}

const iconLink = el('link', {
  rel: 'icon',
  type: 'image/x-icon',
  href: require('./icon.png'),
});

document.head.append(iconLink);

const card = new CreditCard();
