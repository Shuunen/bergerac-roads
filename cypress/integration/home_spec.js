describe('Page accueil', function() {
  it('Chargement initial', function() {
    cy.visit('http://localhost:3000')
    cy.title().should('include', 'Bergerac')
  })
})
