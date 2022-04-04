const cssPromises = {};
const API = 'https://www.swapi.tech/api/films'

const appContainer = document.querySelector('.app');

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

function renderPage(moduleName, apiURL, css, container) {
  Promise.all([moduleName, apiURL, css].map(src => loadResourses(src)))
    .then(([pageModule, data]) => {
      container.innerHTML = '';
      container.append(pageModule.render(data));
    });
}

const searchParams = new URLSearchParams(location.search);
const filmNumber = searchParams.get('film');
if (!filmNumber){
  renderPage(
    './episodes-list.js',
    API,
    'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css',
    appContainer
  );
} else {
  renderPage(
    './episode-details.js',
    `${API}/${filmNumber}`,
    'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css',
    appContainer
  );
}

window.addEventListener('popstate', (event) => {
  const searchParams = new URLSearchParams(location.search);
  const filmNumber = searchParams.get('film');
  if (!filmNumber){
    renderPage(
      './episodes-list.js',
      API,
      'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css',
      appContainer
    );
  } else {
    renderPage(
      './episode-details.js',
      `${API}/${filmNumber}`,
      'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css',
      appContainer
    );
  }
});



