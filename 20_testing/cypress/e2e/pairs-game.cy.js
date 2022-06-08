/* eslint-disable no-lonely-if */
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

  it.skip('Поиск пары', () => {
    // const selectedCellNumber = (firstRow * numberOfRows) + firstCol;
    let shouldStop = false;
    let foundElementIndex = 0;
    cy.get('div#pairs-game > div > div').eq(0).click().invoke('text').as('firstValue');
    cy.get('div#pairs-game > div > div').eq(0).click().invoke('text').as('secondValue');
    cy.wait(500);

    cy.get('div#pairs-game > div > div').each((el, ind, list) => {
      cy.then(() => {
        if (ind !== 0) {
          if (shouldStop) return;
          cy.get('div#pairs-game > div > div').eq(0).click();
          cy.wait(500);
          cy.wrap(el)
          .click()
          .invoke('text')
          .then(text => {
            cy.get('@firstValue').then(firstValue => {
              if (text.localeCompare(firstValue) === 0) {
                foundElementIndex = ind;
                shouldStop = true; 
              }
            });
          });
        };
      });
    });

    cy.get('div#pairs-game > div > div').eq(0).should('not.have.text', '');
    cy.get('div#pairs-game > div > div').eq(foundElementIndex).should('not.have.text', '');
  });

  it('Поиск непарных карточек', () => {
    // const selectedCellNumber = (firstRow * numberOfRows) + firstCol;
    const startIndex = 0;
    let shouldStop = false;
    let pairFound = false;
    let foundElementIndex = 0;
    let secondFoundElementIndex = 0;
    cy.get('div#pairs-game > div > div').eq(startIndex).click().invoke('text').as('firstValue');
    cy.get('div#pairs-game > div > div').eq(startIndex).click().invoke('text').as('secondValue');
    cy.wait(500);

    cy.get('div#pairs-game > div > div').each((el, ind, list) => {
      cy.then(() => {
        if (ind !== startIndex) {
          if (shouldStop) return;
          cy.get('div#pairs-game > div > div').eq(startIndex).click();
          cy.wait(500);
          cy.wrap(el)
          .click()
          .invoke('text')
          .then(text => {
            cy.get('@firstValue').then(firstValue => {
              if (!pairFound && text.localeCompare(firstValue) === 0) {
                pairFound = true;
              } 
              if (pairFound)  {
                foundElementIndex = ind + 1;
              }
            });
            console.log(foundElementIndex, ind);
            if (pairFound && ind === foundElementIndex) {
              cy.wrap(el).invoke('text').as('newValue');
            } 
            if(pairFound && ind > foundElementIndex) {
              cy.get('@newValue').then(newValue => {
                if (text.localeCompare(newValue) !== 0) {
                  shouldStop = true;
                  secondFoundElementIndex = ind;
                }
              });
            }
          });
        };
      });
    });

    cy.get('div#pairs-game > div > div').eq(foundElementIndex).should('have.text', '');
    cy.get('div#pairs-game > div > div').eq(secondFoundElementIndex).should('have.text', '');
  });

});
