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
  cardInputs[0].focus();
  cardInputs[0].value = '4111111111111111';
  cardInputs[0].blur();
  expect(cardInputs[0].classList).not.toContain('border-danger');
});

test('Проверка некорректного номера карты', () => {
  const card = new CreditCard();
  const cardInputs = card.createAndAddElements();
  cardInputs[0].focus();
  cardInputs[0].value = 'умык4./a#%$^^';
  cardInputs[0].blur();
  expect(cardInputs[0].classList).toContain('border-danger');
});

test('Проверка короткого номера карты', () => {
  const card = new CreditCard();
  const cardInputs = card.createAndAddElements();
  cardInputs[0].focus();
  cardInputs[0].value = '111';
  cardInputs[0].blur();
  expect(cardInputs[0].classList).toContain('border-danger');
});
