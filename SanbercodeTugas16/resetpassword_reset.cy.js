/// <reference types="cypress"/>

describe('Login Feature',() => {
it('Pengguna dapat mereset password' ,() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    cy.intercept("GET","**/messages").as("messages");
    cy.get('[class="oxd-text oxd-text--p orangehrm-login-forgot-header"]').click();
    cy.wait('@messages').then((intercept) => {
      expect(intercept.response.statusCode).to.equal(304);
    });
    cy.get('[class="orangehrm-forgot-password-container"]').should('contain','Reset Password');
    cy.get('[name="username"]').type('Admin');
    cy.intercept("POST","**/requestResetPassword").as("request");
    cy.intercept("GET","**/sendPasswordReset").as("send");
    cy.get('[class="oxd-button oxd-button--large oxd-button--secondary orangehrm-forgot-password-button orangehrm-forgot-password-button--reset"]').click();
    cy.wait('@request').then((intercept) => {
      expect(intercept.response.statusCode).to.equal(302);
    });
    cy.get('[class="orangehrm-forgot-password-container"]').should('contain','Reset Password link sent successfully');
    cy.wait('@send').then((intercept) => {
      expect(intercept.response.statusCode).to.equal(200);
    });
  })
})