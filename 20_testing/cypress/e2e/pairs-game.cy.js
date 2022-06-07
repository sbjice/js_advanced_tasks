/* eslint-disable jest/no-disabled-tests */
/* eslint-disable jest/expect-expect */
/* eslint-disable no-undef */
/// <reference types="cypress" />

const numberOfRows = 4;
let firstRow = 0;
let firstCol = 0;

const getRandomBetweenZeroAndNumber = (number) => number - (Math.floor(Math.random() * number)) - 1;

describe('Игра в пары', () => {
  beforeEach(() => {
    firstRow = getRandomBetweenZeroAndNumber(numberOfRows);
    firstCol = getRandomBetweenZeroAndNumber(numberOfRows);
    cy.visit('http://localhost:3000');
    cy.get('input').type(numberOfRows);
    cy.get('button').click();
  });

  it.skip('Проверяется количество строк в поле', () => {
    cy.get('div#pairs-game').children().should('have.length', numberOfRows + 1);
    cy.get('div#pairs-game').children().children().should('have.text', '');
  });

  it.skip('Проверяется отсутствие текста в ячейках', () => {
    cy.get('div#pairs-game').children().children().should('have.text', '');
  });

  it.skip('Ячейка нажимается и остается открытой', () => {
    cy.get('div#pairs-game > div').eq(firstRow).children().eq(firstCol).click();
    cy.get('div#pairs-game > div').eq(firstRow).children().eq(firstCol).should('not.have.text', '');
  });

  it('Поиск пары', () => {
    const selectedCellNumber = (firstRow * numberOfRows) + firstCol;
    cy.get('div#pairs-game > div > div').eq(selectedCellNumber).click().invoke('text').as('firstValue');
    cy.get('@firstValue').then(el => {
      console.log(el);
    });

    cy.get('div#pairs-game > div > div').each((el, ind, list) => {
      if (ind !== selectedCellNumber) {
        cy.get('div#pairs-game > div > div').eq(ind).click().invoke('text').as('val');
        cy.wait(500);
        cy.get('div#pairs-game > div > div').eq(selectedCellNumber).click();
        cy.wait(500);
        return cy.get('@firstValue').then(firstValue => {
          cy.get('@val').then(text => text.localeCompare(firstValue) === 0)
        });
      };
    });
  });

});
