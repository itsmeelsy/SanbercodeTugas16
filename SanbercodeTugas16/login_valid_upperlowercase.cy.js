/// <reference types="cypress"/>


describe('Login Feature',() => {
    it('Pengguna dapat login dengan username valid tanpa memperhatikan huruf besar atau kecil' ,() => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        cy.get('[class="oxd-text oxd-text--h5 orangehrm-login-title"]').should('have.text','Login');
        cy.get('[name="username"]').type('Admin','ADMIN','admin');
        cy.get('[name="password"]').type('admin123');
        cy.intercept("GET","**/messages").as("message"); 
        cy.intercept("GET","**/employees/action-summary").as("actionsummary"); 
        cy.intercept("POST","**/push").as("push");
        cy.intercept("GET","**/shortcuts").as("shortcuts"); 
        cy.intercept("GET","**/feed?limit=5&offset=0&sortOrder=DESC&sortField=share.createdAtUtc").as("feed");
        cy.intercept("GET","**/subunit").as("subunit");
        cy.intercept("GET","**/locations").as("locations");
        cy.get('[class="oxd-button oxd-button--medium oxd-button--main orangehrm-login-button"]').click();

        cy.wait("@actionsummary").then((intercept) => {
            var responseBody = intercept.response.body;
     
            expect(responseBody).to.have.property('data').that.is.an('array');
            responseBody.data.forEach((response) => {
                expect(response).to.have.property('id');
                expect(response).to.have.property('group');
                expect(response).to.have.property('pendingActionCount');
              });
            expect(intercept.response.statusCode).to.equal(200);     
        });

        cy.wait('@message').then((intercept) => {
            expect(intercept.response.statusCode).to.equal(304);
          });

        var alias = [
            "@push","@shortcuts","@feed","@subunit","@locations"];
        alias.forEach((alias) => {
            cy.wait(alias).then((intercept) => {
                expect(intercept.response.statusCode).to.equal(200);
            });
        });
        cy.get('[class="oxd-text oxd-text--h6 oxd-topbar-header-breadcrumb-module"]').should('have.text','Dashboard');
    })
})