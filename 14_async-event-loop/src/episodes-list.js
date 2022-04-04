export function render(data) {
  const container = document.createElement('div');
  container.classList.add('container', 'p-4');


  for (let item of data.result) {
    const cardLink = document.createElement('a');
    cardLink.classList.add('btn', 'btn-light', 'w-50');
    cardLink.href = `?film=${item.uid}`;
    const card = document.createElement('div');
    card.classList.add('card');
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title', 'mb-2');
    cardTitle.textContent = item.uid;
    const cardText = document.createElement('p');
    cardText.classList.add('card-text', 'lead');
    cardText.textContent = item.properties.title;
    cardBody.append(cardTitle, cardText);
    card.append(cardBody);
    cardLink.append(card);

    cardLink.addEventListener(
      'click',
      (event) => {
        // event.preventDefault();
        // history.pushState({'state':''}, '', cardLink.href);
      }
    );
    container.append(cardLink);
  }

  return container;
}
