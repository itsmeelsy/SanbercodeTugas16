/// <reference types="cypress"/>

describe('Login Feature',() => {
  it('Password yang dimasukkan pengguna invisible' ,() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    cy.get('[class="oxd-text oxd-text--h5 orangehrm-login-title"]').should('have.text','Login');
    cy.get('[name="username"]').type('Admin');
    cy.get('[name="password"]').type('admin123');
    cy.get('[name="password"]').should('have.attr', 'type', 'password');

    //interceptions
    cy.intercept("GET","**/messages").as("message"); 
    cy.intercept("GET","**/employees/action-summary").as("actionsummary"); 
    cy.intercept("POST","**/push").as("push");
    cy.intercept("GET","**/shortcuts").as("shortcuts"); 
    cy.intercept("GET","**/feed?limit=5&offset=0&sortOrder=DESC&sortField=share.createdAtUtc").as("feed");
    cy.intercept("GET","**/subunit").as("subunit");
    cy.intercept("GET","**/locations").as("locations");
    cy.get('[class="oxd-button oxd-button--medium oxd-button--main orangehrm-login-button"]').click();

    cy.wait("@shortcuts").then((intercept) => {

      var responseBody = intercept.response.body;
  
      expect(responseBody).to.have.property('data');
  
      expect(responseBody.data).to.have.property('leave.assign_leave').that.is.a('boolean');
      expect(responseBody.data).to.have.property('leave.leave_list').that.is.a('boolean');
      expect(responseBody.data).to.have.property('leave.apply_leave').that.is.a('boolean');
      expect(responseBody.data).to.have.property('leave.my_leave').that.is.a('boolean');
      expect(responseBody.data).to.have.property('time.employee_timesheet').that.is.a('boolean');
      expect(responseBody.data).to.have.property('time.my_timesheet').that.is.a('boolean');
      
      expect(intercept.response.statusCode).to.equal(200); 

    });

    cy.wait('@message').then((intercept) => {
        expect(intercept.response.statusCode).to.equal(304);
      });

    var alias = [
        "@actionsummary","@push","@feed","@subunit","@locations"
    ];

    alias.forEach((alias) => {
        cy.wait(alias).then((intercept) => {
            expect(intercept.response.statusCode).to.equal(200);
        });
    });
    cy.get('[class="oxd-text oxd-text--h6 oxd-topbar-header-breadcrumb-module"]').should('have.text','Dashboard');
    });
  });
