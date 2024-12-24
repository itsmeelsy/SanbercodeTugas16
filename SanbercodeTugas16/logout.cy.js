/// <reference types="cypress"/>


describe('Login Feature',() => {
    it('Pengguna bisa memilih logout dari website' ,() => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        cy.get('[class="oxd-text oxd-text--h5 orangehrm-login-title"]').should('have.text','Login');
        cy.get('[name="username"]').type('Admin');
        cy.get('[name="password"]').type('admin123');
        cy.get('[class="oxd-button oxd-button--medium oxd-button--main orangehrm-login-button"]').click();
        cy.get('[class="oxd-text oxd-text--h6 oxd-topbar-header-breadcrumb-module"]').should('have.text','Dashboard');
        cy.get('[class="oxd-userdropdown-tab"]').click();
        cy.intercept("GET","**/logout").as("logout"); 
        cy.get('[class="oxd-userdropdown-link"]').contains('Logout').click();
        cy.wait('@logout').then((intercept) => {
            expect(intercept.response.statusCode).to.equal(302);
          });
        cy.get('[class="oxd-text oxd-text--h5 orangehrm-login-title"]').should('have.text','Login');

        Cypress.on('uncaught:exception', (err, runnable) => {
            // Mengembalikan `false` untuk mencegah Cypress gagal pada uncaught exceptions
            return false;
          });
          
    })

})