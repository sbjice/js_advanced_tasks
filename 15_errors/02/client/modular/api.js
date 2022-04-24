export const API = 'http://localhost:3000/api/products?status=200';

export function getProducts() {
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
