/* eslint-disable no-lonely-if */
/* eslint-disable jest/no-disabled-tests */
/* eslint-disable jest/expect-expect */
/* eslint-disable no-undef */
/// <reference types="cypress" />

const numberOfRows = 4;
let firstRow = 0;
let firstCol = 0;
const delayInMS = 300;

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
    // const selectedCellNumber = (firstRow * numberOfRows) + firstCol;
    const startIndex = 0;
    let shouldStop = false;
    let foundElementIndex = 0;
    cy.get('div#pairs-game > div > div').eq(startIndex).click().invoke('text').as('firstValue');
    cy.wait(delayInMS);
    cy.get('div#pairs-game > div > div').eq(startIndex).click();

    cy.get('div#pairs-game > div > div').each((el, ind, list) => {
      cy.then(() => {
        if (ind !== startIndex) {
          if (shouldStop) return;
          cy.get('div#pairs-game > div > div').eq(startIndex).click();
          cy.wait(delayInMS);
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

    cy.get('div#pairs-game > div > div').eq(startIndex).should('not.have.text', '');
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
    // cy.wait(delayInMS);
    cy.get('div#pairs-game > div > div').eq(startIndex).click();


    cy.get('div#pairs-game > div > div').each((el, ind, list) => {
      cy.then(() => {
        if (ind !== startIndex) {
          if (shouldStop) return;
          if (!pairFound) cy.get('div#pairs-game > div > div').eq(startIndex).click();
          else cy.get('div#pairs-game > div > div').eq(foundElementIndex).click();
          cy.wait(delayInMS);
          cy.wrap(el)
            .click()
            .invoke('text')
            .then(text => {
              if (!pairFound) {
                cy.get('@firstValue').then(firstValue => {
                  if (text.localeCompare(firstValue) === 0) {
                    pairFound = true;
                    foundElementIndex = ind + 1;
                    cy.wrap(foundElementIndex).as('firstUnpaired');
                  } else {
                    shouldStop = true;
                  }
                });
              } else {
                if (ind !== foundElementIndex) {
                  cy.get('div#pairs-game > div > div')
                    .eq(foundElementIndex)
                    .invoke('text')
                    .then(foundElementText => {
                      if (text.localeCompare(foundElementText) !== 0) {
                        shouldStop = true;
                        secondFoundElementIndex = ind;
                        cy.wrap(secondFoundElementIndex).as('secondUnpaired');
                      } else {
                        foundElementIndex = ind + 1;
                        cy.wrap(foundElementIndex).as('firstUnpaired');
                      }
                    });
                };
              };
              cy.wrap(pairFound).as('pairFound');
            });
        };
      });
    });

    cy.get('@pairFound').then(pFound => {
      if (pFound) {
        cy.get('@firstUnpaired').then(firstUnpaired => {
          cy.get('@secondUnpaired').then(secondUnpaired => {
            cy.get('div#pairs-game > div > div').eq(firstUnpaired).should('have.text', '');
            cy.get('div#pairs-game > div > div').eq(secondUnpaired).should('have.text', '');
          });
        });
      } else {
        cy.get('div#pairs-game > div > div').eq(0).should('have.text', '');
        cy.get('div#pairs-game > div > div').eq(1).should('have.text', '');
      }
    });
  });
});
