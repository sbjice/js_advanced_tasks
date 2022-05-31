import { CreditCard } from '../src/index';

test('Проверка создания элементов на странице', () => {
  const card = new CreditCard();
  const cardInputs = card.createAndAddElements();
  expect(cardInputs).toBeInstanceOf(Array);
  expect(cardInputs.length).toEqual(4);
  expect(cardInputs[0].placeholder).toEqual('Номер карты');
  expect(cardInputs[1].placeholder).toEqual('ММ/ГГ');
  expect(cardInputs[2].placeholder).toEqual('CVV/CVC');
  expect(cardInputs[3].placeholder).toEqual('Email');
});

test('Проверка корректного номера карты', () => {
  const card = new CreditCard();
  const cardInputs = card.createAndAddElements();
  cardInputs[0].value = '4111 1111 1111 1111';
  cardInputs[1].value = '1';
  expect(cardInputs[0].classList).not.toContain('border-danger');
});

test('Проверка некорректного номера карты', () => {
  const card = new CreditCard();
  const cardInputs = card.createAndAddElements();
  cardInputs[0].value = '41111умык4./a#%$^^';
  cardInputs[1].focus();
  expect(cardInputs[0].classList).toContain('border-danger');
});
