/// <reference types="cypress"/>


describe('Login Feature',() => {
    it('Pengguna dapat login menggunakan data valid' ,() => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        cy.get('[class="oxd-text oxd-text--h5 orangehrm-login-title"]').should('have.text','Login');
        cy.get('[name="username"]').type('Admin');
        cy.get('[name="password"]').type('admin123');

        //reponse status code
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
            expect(responseBody).to.have.property('meta');
            expect(responseBody).to.have.property('rels');
            expect(intercept.response.statusCode).to.equal(200);
      
        });

        var alias = [
            "@push","@shortcuts","@feed","@subunit","@locations"
        ];
        alias.forEach((alias) => {
            cy.wait(alias).then((intercept) => {
                expect(intercept.response.statusCode).to.equal(200);
            });
        });

        
        cy.get('[class="oxd-text oxd-text--h6 oxd-topbar-header-breadcrumb-module"]').should('have.text','Dashboard');
    });
});