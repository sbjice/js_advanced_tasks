const cssPromises = {};

function loadResource(src) {
  if (src.endsWith('.js')) {
    return import(src);
  }
  if(src.endsWith('.css')) {
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

loadResource('./style.css');

let products = await fetch('http://localhost:3000/api/products')
	.then(res => {
		let data;
		try {
			data = res.json();
		} catch (error) {
			throw(error);
		}
		return data;
	})
	.catch(error => {
		console.log(error.message);
	})
	.then(data => {
		if (data.error) {
			throw new Error(data.error);
		}
		return data;
	})
	.catch(error => {
		console.log(error.message);
	})
	.then(data => data);

console.log(products);
