import { CreditCard } from '../src/index';

let cardInputs
let card;

beforeEach(() => {
  card = new CreditCard();
  cardInputs = card.createAndAddElements();
});

// Проверка создания элементов

test('Проверка создания элементов на странице', () => {
  expect(cardInputs).toBeInstanceOf(Object);
  expect(Object.keys(cardInputs).length).toEqual(4);
  expect(cardInputs.cardNumber.placeholder).toEqual('Номер карты');
  expect(cardInputs.dateInput.placeholder).toEqual('ММ/ГГ');
  expect(cardInputs.cvvNumber.placeholder).toEqual('CVV/CVC');
  expect(cardInputs.emailInput.placeholder).toEqual('Email');
});

// Проверки относящиеся к номеру карты

test('Проверка корректного номера карты', () => {
  cardInputs.cardNumber.focus();
  cardInputs.cardNumber.value = '4111111111111111';
  cardInputs.cardNumber.blur();
  expect(cardInputs.cardNumber.classList).not.toContain('border-danger');
  expect(card.cardValid).toBe(true);
});

test('Проверка некорректного номера карты', () => {
  cardInputs.cardNumber.focus();
  cardInputs.cardNumber.value = 'умык4./a#%$^^';
  cardInputs.cardNumber.blur();
  expect(cardInputs.cardNumber.classList).toContain('border-danger');
  expect(card.cardValid).not.toBe(true);
});

test('Проверка короткого номера карты', () => {
  cardInputs.cardNumber.focus();
  cardInputs.cardNumber.value = '111';
  cardInputs.cardNumber.blur();
  expect(cardInputs.cardNumber.classList).toContain('border-danger');
  expect(card.cardValid).not.toBe(true);

});

test('Проверка длинного номера карты', () => {
  cardInputs.cardNumber.focus();
  cardInputs.cardNumber.value = '111252356363633463463463467734634373473764';
  cardInputs.cardNumber.blur();
  expect(cardInputs.cardNumber.classList).toContain('border-danger');
  expect(card.cardValid).not.toBe(true);
});

// Проверки относящиеся к CVV/CVC

test('Проверка корректного CVV/CVC', () => {
  cardInputs.cvvNumber.focus();
  cardInputs.cvvNumber.value = '123';
  cardInputs.cvvNumber.blur();
  expect(cardInputs.cvvNumber.classList).not.toContain('border-danger');
  expect(card.cvvValid).toBe(true);
});

test('Проверка CVV/CVC из 2 цифр', () => {
  cardInputs.cvvNumber.focus();
  cardInputs.cvvNumber.value = 12;
  cardInputs.cvvNumber.blur();
  expect(cardInputs.cvvNumber.classList).toContain('border-danger');
  expect(card.cvvValid).not.toBe(true);
});

test('Проверка CVV/CVC из 1 цифры', () => {
  cardInputs.cvvNumber.focus();
  cardInputs.cvvNumber.value = '2';
  cardInputs.cvvNumber.blur();
  expect(cardInputs.cvvNumber.classList).toContain('border-danger');
  expect(card.cvvValid).not.toBe(true);
});

test('Проверка длинного CVV/CVC', () => {
  cardInputs.cvvNumber.focus();
  cardInputs.cvvNumber.value = '23252632747';
  cardInputs.cvvNumber.blur();
  expect(cardInputs.cvvNumber.classList).toContain('border-danger');
  expect(card.cvvValid).not.toBe(true);
});

test('Проверка некорректного CVV/CVC', () => {
  cardInputs.cvvNumber.focus();
  cardInputs.cvvNumber.value = 'fв.';
  cardInputs.cvvNumber.blur();
  expect(cardInputs.cvvNumber.classList).toContain('border-danger');
  expect(card.cvvValid).not.toBe(true);
});
