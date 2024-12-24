/// <reference types="cypress"/>


describe('Login Feature',() => {
it('Pengguna tidak dapat login menggunakan data invalid' ,() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    cy.get('[class="oxd-text oxd-text--h5 orangehrm-login-title"]').should('have.text','Login');
    cy.get('[name="username"]').type('malia');
    cy.get('[name="password"]').type('admin123');
    cy.intercept("GET","**/messages").as("message"); 
    cy.get('[class="oxd-button oxd-button--medium oxd-button--main orangehrm-login-button"]').click();
    cy.wait('@message').then((intercept) => {
      expect(intercept.response.statusCode).to.equal(304);
    });
    cy.get('[class="oxd-alert-content oxd-alert-content--error"]').should('have.text','Invalid credentials');
  })
    
})