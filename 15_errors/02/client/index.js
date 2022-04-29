const API = 'http://localhost:3000/api/products';
const updateLaterText = 'Произошла ошибка, попробуйте обновить страницу позже. ';
const cssPromises = {};

const resources = [
  './style.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css'
]


function loadResource(src) {
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
}

resources.forEach(loadResource);

function createToaster(){
  const toaster = document.createElement('ul');
  toaster.classList.add('toaster',
                        'mb-0', 'w-25', 'p-0',
                        'd-flex', 'flex-column',
                        'justify-content-center',
                        'align-items-center');
  return {
    toaster,
    addToast: function(toastText = 'Text') {
      const toast = document.createElement('li');
      toast.classList.add('toast_js', 'rounded', 'bg-info',
                          'p-3','mb-1',
                          'w-100',
                          'd-inline-flex', 'justify-content-center',
                          'align-items-center');
      toast.textContent = toastText;
      this.toaster.append(toast);
      // console.log('toast added');
      setTimeout(() => {
        toast.remove();
      },3000);
    },
  }
}

function getProducts() {
  return fetch(API)
    .then(res => {
      if (res.status === 404) return null;
      if (res.status === 500) return 'Need retry';
      return res.json();
    })
    .then(data => {
      if (data.error) throw new Error(data.error);
      return data;
    })
    .catch(e => {
      if (e instanceof SyntaxError) {
        return 'Invalid JSON';
      }
      else if (e instanceof Error) console.log(e.message);
      return null;
    })
    .then(data => data);
}

function getAppContainer() {
  const appContainer = document.createElement('div');
  appContainer.classList.add('container', 'app', 'd-flex', 'flex-wrap', 'p-3', 'justify-content-center', 'my-3');
  return appContainer;
}

function fillContainerWithData(container, data) {
  for (let item of data.products) {
    const card = document.createElement('div');
    card.classList.add('card', 'w-50');
    const cardImage = document.createElement('img');
    cardImage.classList.add('card-img-top', 'mb-1');
    cardImage.src = item.image;
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title', 'mb-2');
    cardTitle.textContent = item.name;
    const cardText = document.createElement('p');
    cardText.classList.add('card-text', 'lead');
    cardText.textContent = item.price;
    cardBody.append(cardImage, cardTitle, cardText);
    card.append(cardBody);
    container.append(card);
  }
}

function getErrorHeader(errorText = updateLaterText) {
  const header = document.createElement('h1');
  header.classList.add('mx-auto', 'lead', 'm-0');
  header.textContent = errorText;
  return header;
}

function createSpinner() {
  const spinnerContainer = document.createElement('div');
  spinnerContainer.classList.add('d-flex', 'justify-content-center', 'spinner', 'mt-3');
  const spinner = document.createElement('div');
  spinner.classList.add('spinner-border');
  spinner.setAttribute('role', 'status');
  const spinnerSpan = document.createElement('span');
  spinnerSpan.classList.add('sr-only');
  spinner.append(spinnerSpan);
  spinnerContainer.append(spinner);
  return spinnerContainer;
}

async function fillContainer(appContainer) {
  const spinner = createSpinner();
  appContainer.append(spinner);
  let products = await getProducts();
  if (products === 'Need retry') {
    toaster.addToast('Need retry');
    for (let i=0; i<2; i++) {
      products = await getProducts();
      if (products !== 'Need retry') break;
      else toaster.addToast('Need retry');
    }
  }
  // console.log(products);
  if (products === 'Need retry') {
    const header = getErrorHeader();
    // toaster.addToast('Need retry');
    appContainer.append(header);
  } else if (products === 'Invalid JSON') {
    const header = getErrorHeader(updateLaterText);
    toaster.addToast('Invalid JSON');
    appContainer.append(header);
  } else if (products === null) {
    const header = getErrorHeader('Список товаров пуст');
    toaster.addToast('Список товаров пуст');
    appContainer.append(header);
  } else {
    fillContainerWithData(appContainer, products);
  }
  spinner.remove();
}

const appContainer = getAppContainer();
const toaster = createToaster();
document.body.append(toaster.toaster);
document.body.append(appContainer);

window.addEventListener('offline', function(e) {
  toaster.addToast('Going offline');
});

window.addEventListener('online', async function(e) {
  toaster.addToast('Going offline');
  appContainer.innerHTML = '';
  await fillContainer(appContainer);
});
await fillContainer(appContainer);
