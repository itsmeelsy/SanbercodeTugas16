
/// <reference types="cypress"/>

describe('Login Feature',() => {
    it('Pengguna dapat login menggunakan password alfanumerik' ,() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    cy.get('[class="oxd-text oxd-text--h5 orangehrm-login-title"]').should('have.text','Login');
    cy.get('[name="username"]').type('Admin');
    cy.get('[name="password"]').type('admin123');
    var regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]*$/;  //untuk alfanumerik: harus ada huruf dan angka
    cy.get('[name="password"]').invoke('val').should('match', regex);

    //intercept
    cy.intercept("GET","**/messages").as("message"); 
    cy.intercept("GET","**/employees/action-summary").as("actionsummary"); 
    cy.intercept("POST","**/push").as("push");
    cy.intercept("GET","**/shortcuts").as("shortcuts"); 
    cy.intercept("GET","**/feed?limit=5&offset=0&sortOrder=DESC&sortField=share.createdAtUtc").as("feed");
    cy.intercept("GET","**/subunit").as("subunit");
    cy.intercept("GET","**/locations").as("locations");

    cy.get('[class="oxd-button oxd-button--medium oxd-button--main orangehrm-login-button"]').click();

    //intercept
    cy.wait("@subunit").then((intercept) => {

    var responseBody = intercept.response.body;

    expect(responseBody).to.have.property('data').that.is.an('array');

    responseBody.data.forEach((response) => {
      // Memastikan bahwa setiap item dalam array 'data' memiliki properti 'subunit'
      expect(response).to.have.property('subunit');
      expect(response.subunit).to.have.property('id');
      expect(response.subunit).to.have.property('name');
      
      expect(response).to.have.property('count').that.is.a('number');
  
    // Memastikan bahwa meta berisi informasi yang valid
      expect(responseBody.meta).to.have.property('otherEmployeeCount');
      expect(responseBody.meta).to.have.property('unassignedEmployeeCount');
      expect(responseBody.meta).to.have.property('totalSubunitCount');

      expect(intercept.response.statusCode).to.equal(200); 
    });
    

    cy.wait('@message').then((intercept) => {
      expect(intercept.response.statusCode).to.equal(304);
    });

    var alias = [
     "@actionsummary","@push","@shortcuts","@feed","@locations"
    ];
    alias.forEach((alias) => {
      cy.wait(alias).then((intercept) => {
        expect(intercept.response.statusCode).to.equal(200);
        });
    });
    cy.get('[class="oxd-text oxd-text--h6 oxd-topbar-header-breadcrumb-module"]').should('have.text','Dashboard');
  });
});

});
