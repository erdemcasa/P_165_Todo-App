/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

Cypress.Commands.add("resetDb", () => {
  // send request to reset the database
  cy.request("POST", `${Cypress.env('BACKEND_URL') as string}/test/reset`);
});

Cypress.Commands.add("createUser", (email: string, password: string) => {
  // send create user request
  cy.request("POST", `${Cypress.env('BACKEND_URL') as string}/api/user/`, {
    email,
    password,
  });
});

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session(
    email,
    () => {
      cy.visit('/login');
      cy.get('input[name=email]').type(email);
      cy.get('input[name=password]').type(`${password}{enter}`, { log: false });
      cy.url().should('include', '/');
    },
    {
      validate: () => {
        cy.window().then((win) => {
          expect(win.localStorage.getItem('token')).to.be.a('string');
        });
      },
    }
  )
});


  
// Augment Cypress types to include our custom commands so their string names are accepted.
declare global {
  namespace Cypress {
    interface Chainable {
      resetDb(): Chainable;
      createUser(email: string, password: string): Chainable;
      login(email: string, password: string): Chainable;
    }
  }
}

export {};

