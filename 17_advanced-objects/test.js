export function wait(ms, valueToReturn = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (ms > 5000) reject('too long');
      resolve(valueToReturn);
    }, ms);
  });
}


export default class Hello {
  constructor() {
    console.log('sayHello');
  }
}
