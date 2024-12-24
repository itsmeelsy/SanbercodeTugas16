/// <reference types="cypress"/>

describe('Login Feature',() => {
it('Pengguna dapat membatalkan reset password' ,() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    cy.intercept("GET","**/messages").as("messages");
    cy.get('[class="oxd-text oxd-text--p orangehrm-login-forgot-header"]').click();
    cy.wait('@messages').then((intercept) => {
      expect(intercept.response.statusCode).to.equal(304);
    });
    cy.get('[class="orangehrm-forgot-password-container"]').should('contain','Reset Password');
    cy.get('[name="username"]').type('Admin');
    cy.intercept("GET","**/messages").as("messages");
    cy.intercept("GET","**/login").as("login");
    cy.get('[class="oxd-button oxd-button--large oxd-button--ghost orangehrm-forgot-password-button orangehrm-forgot-password-button--cancel"]').click();
    cy.wait('@messages').then((intercept) => {
      expect(intercept.response.statusCode).to.equal(304);
    });
    cy.wait('@login').then((intercept) => {
      expect(intercept.response.statusCode).to.equal(200);
    });
    cy.get('[class="oxd-text oxd-text--h5 orangehrm-login-title"]').should('have.text','Login');
  })
})