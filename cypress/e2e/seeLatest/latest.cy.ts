describe('See latest button as new node are added', () => {
  it.skip('See latest as nodes are being added', () => {
    cy.initialSetup('carol', 300)

    // add tweet node
    cy.fixture('trendingTopics.json').then(async (data) => {
      //   await addTweetNodeToJarvisBackend(data)
      for (let i = 0; i < data.length; i += 1) {
        let newDate
        const date = new Date()

        if (i % 2 === 0) {
          newDate = date.toISOString()
        } else {
          const formatDate = new Date(date)

          formatDate.setDate(date.getDate() - 3)
          newDate = formatDate.toISOString()
        }

        cy.request({
          method: 'POST',
          url: 'http://localhost:8444/v1/tweet',
          headers: {
            'Content-Type': 'application/json',
            'x-api-token': 'navfiber-tester',
          },
          body: { ...data[i], newDate },
        })
      }

      cy.intercept({
        method: 'GET',
        url: 'http://localhost:8444/api/prediction/graph/search*',
      }).as('getLatest')

      cy.get('[data-testid="see_latest_button"]').should('exist')

      cy.get('[data-testid="see_latest_button"]').click()
      cy.wait('@getLatest')

      cy.get('[data-testid="see_latest_button"]').should('not.exist')

      cy.get('[data-testid="twitter"]').should('exist')

      cy.intercept({
        method: 'GET',
        url: 'http://localhost:8444/api/prediction/graph/search*',
      }).as('twitter')

      cy.get('[data-testid="twitter"]').click()

      cy.wait('@twitter')
      // TODO: Get to know if twitter nodes are what is being returned

      // .then((interception) => {
      //   const { query } = interception.request

      //   expect(query.media_type).to.equal('twitter')
      // })

      cy.get('#search-result-list').children().first().click()

      cy.get('[data-testid="sidebar-sub-view"]').should('have.css', 'position', 'relative')

      cy.get('[data-testid="close-sidebar-sub-view"]').click()

      cy.get('[data-testid="sidebar-sub-view"]').should('have.css', 'position', 'absolute')
    })
  })
})
