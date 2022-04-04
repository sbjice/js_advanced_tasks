export function render(data) {
  const container = document.createElement('div');
  container.classList.add('container', 'p-4');

  const card = document.createElement('div');
  card.classList.add('card');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h1');
  cardTitle.classList.add('card-title', 'mb-2');
  cardTitle.textContent = data.result.properties.title;
  const cardText = document.createElement('p');
  cardText.classList.add('card-text', 'lead');
  cardText.textContent = data.result.properties.opening_crawl;

  const backButton = document.createElement('a');
  backButton.classList.add('btn', 'btn-primary');
  backButton.textContent = 'Back to Episodes';
  backButton.href = location.toString().replace(location.search, '');
  backButton.addEventListener(
    'click',
    (event) => {
      // event.preventDefault();
      // let locStr = location.toString();
      // locStr = locStr.replace(location.search, '');
      // history.pushState({'state':''}, '', locStr);
    }
  );

  cardBody.append(cardTitle, cardText, backButton);
  card.append(cardBody);


  container.append(card);
  return container;
}
