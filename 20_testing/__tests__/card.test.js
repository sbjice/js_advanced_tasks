import { CreditCard } from '../src/index';

test('Проверка создания элементов на странице', () => {
  const card = new CreditCard();
  const cardInputs = card.createAndAddElements();
  expect(cardInputs).toBeInstanceOf(Array);
  expect(cardInputs.length).toEqual(4);
  expect(cardInputs[0].placeholder).toEqual('Номер карты');
});
