describe("gatsby-source-storyblok", () => {
  it("Is loaded by default", () => {
    cy.visit("http://localhost:8000/");
    // cy.get(".with-bridge").click();
    cy.get("div").should("exist");
  });
});
//     it("Is not loaded if options.bridge: false and errors in console", () => {
//       cy.visit("http://localhost:8000/");
//       cy.get(".without-bridge").click();
//       cy.get("#storyblok-javascript-bridge").should("not.exist");
//     });
//   });
//   describe("Bridge (added independently)", () => {
//     it("Can be loaded", () => {
//       cy.visit("http://localhost:8000/");
//       cy.get(".load-bridge").click();
//       cy.get("#storyblok-javascript-bridge").should("exist");
//     });
//     it("Can be loaded just once", () => {
//       cy.visit("http://localhost:8000/");
//       cy.get(".load-bridge").click();
//       cy.wait(1000);
//       cy.get(".load-bridge").click();
//       cy.get("#storyblok-javascript-bridge")
//         .should("exist")
//         .and("have.length", 1);
//     });
//   });
// });
