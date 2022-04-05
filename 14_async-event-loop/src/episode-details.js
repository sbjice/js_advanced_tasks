function drawItems(data) {
  Promise.all(data.map(src => fetch(src)))
    .then(data => data.map(async item => await item.json()));
}

export function render(data) {
  console.log(data);
  const container = document.createElement('div');
  container.classList.add('container', 'p-5', 'bg-light', 'rounded', 'my-5');

  const card = document.createElement('div');
  card.classList.add('card');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body', 'mb-2');
  const cardTitle = document.createElement('h1');
  cardTitle.classList.add('card-title', 'mb-2');
  cardTitle.textContent = `${data.result.properties.title}, episode ${data.result.properties.episode_id}`;
  const cardText = document.createElement('p');
  cardText.classList.add('card-text', 'lead');
  cardText.textContent = data.result.properties.opening_crawl;

  const planetsHeader = document.createElement('h2');
  planetsHeader.textContent = 'Planets';
  const planetsList = document.createElement('ul');
  planetsList.style.listStyleType = 'none';

  const planets = drawItems(data.result.properties.planets);
  console.log(planets);
  // planets.forEach(item => {
  //   const li = document.createElement('li');
  //   li.textContent = item.value;
  //   planetsList.append(li);
  // });


  const backButton = document.createElement('a');
  backButton.classList.add('btn', 'btn-primary');
  backButton.textContent = 'Back to Episodes';
  backButton.href = location.toString().replace(location.search, '');
  backButton.addEventListener(
    'click',
    (event) => {
      event.preventDefault();
      history.pushState({
        'state': ''
      }, '', location.toString().replace(location.search, ''));
      let popStateEvent = new PopStateEvent('popstate', {
        state: null
      });
      dispatchEvent(popStateEvent);
    }
  );

  cardBody.append(cardTitle, cardText, planetsHeader, planetsList, backButton);
  card.append(cardBody);

  container.append(card);
  return {
    container,
    title: data.result.properties.title
  };
}
