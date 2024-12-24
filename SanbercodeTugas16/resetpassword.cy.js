/// <reference types="cypress"/>

describe('Login Feature',() => {
it('Pengguna dapat menuju halaman reset password' ,() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    cy.get('[class="oxd-text oxd-text--h5 orangehrm-login-title"]').should('have.text','Login');

    cy.intercept("GET","**/requestPasswordResetCode").as("resetpassword"); 
    cy.intercept("GET","**/messages").as("messages");
    cy.intercept("GET","**/requestPasswordResetCode").as("request");

    cy.get('[class="oxd-text oxd-text--p orangehrm-login-forgot-header"]').click();
    cy.wait('@resetpassword').then((intercept) => {
      expect(intercept.response.statusCode).to.equal(200);
    });
    cy.wait('@messages').then((intercept) => {
      expect(intercept.response.statusCode).to.equal(304);
    });
    cy.wait('@request').then((intercept) => {
      expect(intercept.response.body).to.be.a('string');
    })
    cy.get('[class="orangehrm-forgot-password-container"]').should('contain','Reset Password');
  })
})