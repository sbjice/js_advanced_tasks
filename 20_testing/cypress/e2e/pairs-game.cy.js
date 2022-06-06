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

  it('Проверяется количество строк в поле', () => {
    cy.get('div#pairs-game').children().should('have.length', numberOfRows + 1);
    cy.get('div#pairs-game').children().children().should('have.text', '');
  });

  it('Проверяется отсутствие текста в ячейках', () => {
    cy.get('div#pairs-game').children().children().should('have.text', '');
  });

  it('Ячейка нажимается и остается открытой', () => {
    cy.get('div#pairs-game > div').eq(firstRow).children().eq(firstCol).click();
    cy.get('div#pairs-game > div').eq(firstRow).children().eq(firstCol).should('not.have.text', '');
  });

  it('Поиск пары', () => {
    let firstValue = '';
    let secondValue = ' ';
    // let equals = false;
    cy.get('div#pairs-game > div').each((el, ind, list) => {
      // if (equals) return false;
      cy.get('div#pairs-game > div').eq(ind).children().each((el1, ind1, list1) => {
        cy.get('div#pairs-game > div').eq(firstRow).children().eq(firstCol).click().then($item => {
          firstValue = $item.text();
          console.log(firstValue);
        });
        cy.wait(500);
        cy.get('div#pairs-game > div').eq(ind).children().eq(ind1).click().then($item => {
          secondValue = $item.text();
          console.log(secondValue);
        });
        cy.wait(500);
        console.log(firstValue, secondValue);
        // if (firstValue.localeCompare(secondValue) === 0) {
        //   equals = true;
        //   console.log(equals);
        //   return false;
        // }
      });
    })
  });

});
