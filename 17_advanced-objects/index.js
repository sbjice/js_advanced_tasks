// function getPrototype(obj) {
//   const prot = Object.getPrototypeOf(obj);
//   const dat = [];
//   if (prot) {
//     // if (typeof prot === 'function') dat.push(prot.name);
//     // else dat.push(prot);
//     // dat.push(obj.name, ...getPrototype(prot));
//     dat.push(obj, ...getPrototype(prot));
//   }
//   return dat;
// }

// function getPrototypesChain(obj = window) {
//   if (!obj) return null;
//   let elem = obj;
//   const protos = [];
//   while (elem) {
//     if (elem.name !== undefined) {
//       elem.name === '' ? null : protos.push(elem.name);
//     } else protos.push(elem.constructor.name);
//     elem = Object.getPrototypeOf(elem);
//   }

//   return protos;
// }

// function getPrototypeProperties(prot, obj = window) {
//   const props = Object.getOwnPropertyNames(obj[prot]);
//   const propsArr = props.map(prop => {
//     return {
//       prop,
//       type: typeof obj[prot][prop],
//     }
//   })
//   return propsArr;
// }

// function createReprForProps(prot, props) {
//   const prototypeBlock = document.createElement('div');
//   prototypeBlock.classList.add('d-flex', 'flex-column', 'w-100', 'mb-3', 'rounded', 'border');

//   const protBlockHeader = document.createElement('h3');
//   protBlockHeader.classList.add('lead');
//   protBlockHeader.textContent = prot;

//   const propsList = document.createElement('ol');
//   propsList.classList.add('d-flex', 'flex-column', 'p-0', 'mb-0', 'rounded');

//   props.forEach(item => {
//     const propItem = document.createElement('li');
//     propItem.classList.add('rounded', 'd-flex', 'flex-column', 'rounded', 'mb-0');

//     const propName = document.createElement('p')
//     propName.classList.add('mb-0', 'bg-success', 'py-3');
//     propName.textContent = item.prop;
//     propName.style.minHeight = '50px';

//     const propType = document.createElement('p')
//     propType.classList.add('mb-0', 'bg-primary', 'py-auto');
//     propType.textContent = item.type;
//     propType.style.minHeight = '50px';

//     propItem.append(propName, propType);
//     propsList.append(propItem)
//   });

//   prototypeBlock.append(protBlockHeader, propsList);
//   return prototypeBlock;
// }


// const protos = getPrototypesChain(window['HTMLInputElement']);
// protos.forEach(item => {
//   const protosProps = getPrototypeProperties(item);
//   const protBlock = createReprForProps(item, protosProps);
//   document.body.append(protBlock);
// });


// console.log(getPrototypes(window['HTMLInputElement']));
// console.log(getPrototypes(window['EventTarget']));



export class PrototypeChecker {
  constructor(inspectableObject = window) {
    this.inspectableObject = inspectableObject;
    this.createContainer();
    this.createForm();
    this.createErrorList();
  }

  createContainer() {
    const container = document.createElement('div');
    container.classList.add('container', 'rounded', 'w-100', 'inspector', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center', 'my-5', 'p-0');
    this.container = container;
    document.body.append(this.container);
  }

  createForm() {
    const form = document.createElement('form');
    form.classList.add('form-group', 'd-flex', 'flex-row', 'align-items-center', 'inspector-form', 'w-100', 'h-100', 'mb-3');

    const input = document.createElement('input');
    input.classList.add('form-control', 'h-100');
    input.type = 'text';

    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.classList.add('btn', 'btn-primary', 'h-100');
    submit.textContent = 'Показать цепочку прототипов';
    submit.style.whiteSpace = 'nowrap';


    this.form = form;
    this.input = input;
    this.submit = submit;
    this.configSubmitButton();
    form.append(input, submit);
    if (this.container) this.container.append(form);
  }

  configSubmitButton() {
    this.submit.addEventListener(
      'click',
      (e) => {
        e.preventDefault();
        this.clearErrorsList();
        if (!this.input.value) return;
        if (this.prototypeBlocksContainer) this.prototypeBlocksContainer.remove();
        const errorMessages = this.validateInputValue();
        this.fillErrorsList();
        if (errorMessages) {
          this.input.classList.add('border-danger');
          return;
        }
        this.input.classList.remove('border-danger');
        this.createPrototypeBlocksContainer();
        const obj = this.inspectableObject[this.input.value];
        this.getPrototypesChain(obj);

        this.protos.forEach(item => {
          this.getPrototypeProperties(item);
          const protBlock = this.createReprForProps(item, this.propsArr);
          this.prototypeBlocksContainer.append(protBlock);
        });

      }
    )
  }

  validateInputValue() {
    if (!this.input.value) return null;
    this.errors = [];
    if (!this.inspectableObject || !this.inspectableObject[this.input.value]) {
      this.errors.push('Нет такого элемента');
    }
    return this.errors.length ? this.errors : null;
  }

  createErrorList() {
    this.errors = [];
    const errorsList = document.createElement('ul');
    errorsList.classList.add('w-100', 'd-flex', 'flex-column', 'p-0', 'm-0', 'error-list');
    errorsList.style.listStyleType = 'none';
    this.errorsList = errorsList;
    this.container.append(this.errorsList);
  }

  fillErrorsList() {
    if (!this.errors.length) return;
    this.showErrorsList();
    this.errors.forEach(item => {
      const errorItem = document.createElement('li');
      errorItem.classList.add('rounded', 'bg-danger', 'd-flex', 'align-items-center', 'p-2');
      errorItem.textContent = item;
      errorItem.style.minHeight = '50px';
      this.errorsList.append(errorItem);
    })
  }

  showErrorsList() {
    this.errorsList.classList.remove('d-none');
    this.errorsList.classList.add('d-flex');
  }

  hideErrorsList() {
    this.errorsList.classList.remove('d-flex');
    this.errorsList.classList.add('d-none');
  }

  clearErrorsList() {
    this.errors = [];
    this.errorsList.innerHTML = '';
    this.hideErrorsList();
  }

  getPrototypesChain(obj = this.inspectableObject) {
    if (!obj) return null;
    let elem = obj;
    const protos = [];
    while (elem) {
      if (elem.name !== undefined) {
        elem.name === '' ? null : protos.push(elem.name);
      } else protos.push(elem.constructor.name);
      elem = Object.getPrototypeOf(elem);
    }

    this.protos = protos;
    return protos;
  }

  getPrototypeProperties(prot) {
    const props = Object.getOwnPropertyNames(this.inspectableObject[prot]);
    const propsArr = props.map(prop => {
      return {
        prop,
        type: typeof this.inspectableObject[prot][prop],
      }
    })
    this.propsArr = propsArr;
  }

  createReprForProps(prot, props) {
    const prototypeBlock = document.createElement('div');
    prototypeBlock.classList.add('d-flex', 'flex-column', 'w-100', 'mb-3', 'rounded', 'border', 'p-2');

    const protBlockHeader = document.createElement('h3');
    protBlockHeader.classList.add('lead');
    protBlockHeader.textContent = prot;

    const propsList = document.createElement('ol');
    propsList.classList.add('d-flex', 'flex-column', 'p-0', 'mb-0', 'rounded', 'border');

    props.forEach(item => {
      const propItem = document.createElement('li');
      propItem.classList.add('rounded', 'd-flex', 'flex-row', 'rounded', 'mb-0', 'border');

      const propName = document.createElement('p')
      propName.classList.add('mb-0', 'bg-success', 'w-50', 'p-2');
      propName.textContent = item.prop;

      const propType = document.createElement('p')
      propType.classList.add('mb-0', 'bg-primary', 'w-50', 'p-2');
      propType.textContent = item.type;

      propItem.append(propName, propType);
      propsList.append(propItem);
    });

    prototypeBlock.append(protBlockHeader, propsList);
    return prototypeBlock;
  }

  createPrototypeBlocksContainer() {
    const prototypeBlocksContainer = document.createElement('div');
    prototypeBlocksContainer.classList.add('w-100', 'inspector', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center', 'p-0');
    this.prototypeBlocksContainer = prototypeBlocksContainer;
    this.container.append(this.prototypeBlocksContainer);
  }
}
