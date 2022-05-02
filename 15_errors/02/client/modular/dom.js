const updateLaterText = 'Произошла ошибка, попробуйте обновить страницу позже. ';
import { getProducts } from "./api";

export function getAppContainer() {
  const appContainer = document.createElement('div');
  appContainer.classList.add('container', 'app', 'd-flex', 'flex-wrap', 'p-3', 'justify-content-center', 'my-3');
  return appContainer;
}

export function fillContainerWithData(container, data) {
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

export function getErrorHeader(errorText = updateLaterText) {
  const header = document.createElement('h1');
  header.classList.add('mx-auto', 'lead', 'm-0');
  header.textContent = errorText;
  return header;
}

export function createSpinner() {
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

export async function fillContainer(appContainer) {
  const spinner = createSpinner();
  appContainer.append(spinner);
  let products = await getProducts();
  if (products === 'Need retry') {
    for (let i=0; i<2; i++) {
      products = await getProducts();
      if (products !== 'Need retry') break;
    }
  }
  console.log(products);
  if (products === 'Need retry') {
    const header = getErrorHeader();
    appContainer.append(header);
  } else if (products === 'Invalid JSON') {
    const header = getErrorHeader(updateLaterText + products);
    appContainer.append(header);
  } else if (products === null) {
    const header = getErrorHeader('Список товаров пуст');
    appContainer.append(header);
  } else {
    fillContainerWithData(appContainer, products);
  }
  spinner.remove();
}
