/// <reference types="cypress"/>


describe('Login Feature',() => {
    it('Pengguna tidak dapat login jika username kosong' ,() => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        cy.get('[class="oxd-text oxd-text--h5 orangehrm-login-title"]').should('have.text','Login');
        cy.get('[name="username"]').clear();
        cy.get('[name="password"]').type('admin123');
        //cy.intercept("GET","**/messages").as("message"); 
        cy.get('[class="oxd-button oxd-button--medium oxd-button--main orangehrm-login-button"]').click();
        //cy.wait("@message");
        cy.get('[class="oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message"]').should('have.text','Required');
      })
    })