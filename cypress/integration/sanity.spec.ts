/// <reference types="cypress" />

import { MovieProps } from "../../src/Results";

context("Nominate movies", () => {
  const HEADER = "The Shoppies";
  const BANNER = "You have nominated 5 movies! 🎉";
  const NO_MOVIES_FOUND = "No Movies found 💩";
  const NO_NOMINATIONS = "No nominations...yet! 🥺";
  const ENTER_TITLE = "Please enter a movie title ☝️";
  const RESULTS_HEADER = "Results";
  const NOMINATIONS_HEADER = "Nominations";

  beforeEach(() => {
    cy.visit("/");
    cy.findByText(HEADER).should("be.visible");
    cy.findByTestId("nominations-card")
      .findByText(NO_NOMINATIONS)
      .should("be.visible");
    cy.findByTestId("nominations-card")
      .findByText(NOMINATIONS_HEADER)
      .should("be.visible");
    cy.findByTestId("results-card")
      .findByText(RESULTS_HEADER)
      .should("be.visible");
    cy.findByTestId("results-card")
      .findByText(ENTER_TITLE)
      .should("be.visible");
  });

  it("search has no results", () => {
    const title = "6d5MXo29vz";
    cy.intercept("GET", `https://www.omdbapi.com/?apikey=*&s=${title}`, {
      fixture: "no-movies",
    });
    cy.findByTestId("input-movie-title").type(title);
    cy.findByTestId("results-card")
      .findByText(NO_MOVIES_FOUND)
      .should("be.visible");
    cy.findByText(NO_NOMINATIONS).should("be.visible");
  });

  it("search has multiple results", () => {
    const title = "jurassic";
    cy.intercept("GET", `https://www.omdbapi.com/?apikey=*&s=${title}`, {
      fixture: title,
    });
    cy.findByTestId("input-movie-title").type(title);
    cy.findByText(NO_MOVIES_FOUND).should("not.exist");
    cy.findByText(NO_NOMINATIONS).should("be.visible");
    cy.findByText(`Results for "${title}"`).should("be.visible");
    cy.fixture(title).then((json) => {
      cy.wrap(json.Search).each((movie: MovieProps) => {
        cy.findByTestId("results-card")
          .contains("li", `${movie.Title} (${movie.Year})`)
          .should("be.visible");
      });
    });
  });

  it("update search results", () => {
    const titan = "titan";
    cy.intercept("GET", `https://www.omdbapi.com/?apikey=*&s=${titan}`, {
      fixture: titan,
    });
    const titanic = "titanic";
    cy.intercept("GET", `https://www.omdbapi.com/?apikey=*&s=${titanic}`, {
      fixture: titanic,
    });
    cy.findByTestId("input-movie-title").type(titan);
    cy.fixture(titan).then((json) => {
      cy.wrap(json.Search).each((movie: MovieProps) => {
        cy.findByTestId("results-card")
          .contains("li", `${movie.Title} (${movie.Year})`)
          .should("be.visible");
      });
    });
    cy.findByTestId("input-movie-title").type("ic");
    cy.fixture(titanic).then((json) => {
      cy.wrap(json.Search).each((movie: MovieProps) => {
        cy.findByTestId("results-card")
          .contains("li", `${movie.Title} (${movie.Year})`)
          .should("be.visible");
      });
    });
  });

  it("nominate movies", () => {
    const title = "jurassic";
    cy.intercept("GET", `https://www.omdbapi.com/?apikey=*&s=${title}`, {
      fixture: title,
    });
    cy.findByTestId("input-movie-title").type(title);
    cy.fixture(title).then((json) => {
      cy.findByTestId("results-card")
        .findByTestId(`nominate-${json.Search[0].imdbID}`)
        .should("have.text", "Nominate")
        .click();
      cy.findByTestId("results-card")
        .findByTestId(`nominate-${json.Search[0].imdbID}`)
        .should("not.be.enabled");
      cy.findByText(NO_NOMINATIONS).should("not.exist");
      cy.findByTestId("nominations-card")
        .findByTestId(`remove-${json.Search[0].imdbID}`)
        .should("have.text", "Remove")
        .should("be.enabled");
    });
  });

  it("remove nominations", () => {
    const title = "titanic";
    cy.intercept("GET", `https://www.omdbapi.com/?apikey=*&s=${title}`, {
      fixture: title,
    });
    cy.findByTestId("input-movie-title").type(title);
    cy.fixture(title).then((json) => {
      [1, 3, 5].forEach((index) => {
        cy.findByTestId("results-card").within(() => {
          cy.findByTestId(`nominate-${json.Search[index].imdbID}`).click();
          cy.findByTestId(`nominate-${json.Search[index].imdbID}`).should(
            "not.be.enabled"
          );
        });
        cy.findByTestId("nominations-card")
          .findByTestId(`remove-${json.Search[index].imdbID}`)
          .should("be.enabled");
      });
      [5, 3].forEach((index) => {
        cy.findByTestId("nominations-card").within(() => {
          cy.findByTestId(`remove-${json.Search[index].imdbID}`).click();
          cy.findByTestId(`remove-${json.Search[index].imdbID}`).should(
            "not.exist"
          );
        });
        cy.findByTestId("results-card")
          .findByTestId(`nominate-${json.Search[index].imdbID}`)
          .should("be.enabled");
      });
      cy.findByTestId("nominations-card")
        .findByTestId(`remove-${json.Search[1].imdbID}`)
        .should("be.enabled");
      cy.findByTestId("results-card")
        .findByTestId(`nominate-${json.Search[1].imdbID}`)
        .should("not.be.enabled");
    });
  });

  it("nomiante 5 or more movies shows the special banner", () => {
    const title = "titanic";
    cy.intercept("GET", `https://www.omdbapi.com/?apikey=*&s=${title}`, {
      fixture: title,
    });
    cy.findByTestId("input-movie-title").type(title);
    cy.fixture(title).then((json) => {
      [0, 1, 2, 3, 4].forEach((index) => {
        cy.contains(BANNER).should("not.exist");
        cy.findByTestId(`nominate-${json.Search[index].imdbID}`).click();
      });
      [5, 6].forEach((index) => {
        cy.contains(BANNER).should("be.visible");
        cy.findByTestId(`nominate-${json.Search[index].imdbID}`).click();
      });
      [0, 1, 2].forEach((index) => {
        cy.contains(BANNER).should("be.visible");
        cy.findByTestId(`remove-${json.Search[index].imdbID}`).click();
      });
      cy.contains(BANNER).should("not.exist");
    });
  });

  it("nominate all movies", () => {
    const title = "green mile";
    cy.intercept("GET", `https://www.omdbapi.com/?apikey=*&s=greeen+mile`, {
      fixture: "green-mile",
    });
    cy.findByTestId("input-movie-title").type(title);
    cy.fixture("green-mile").then((json) => {
      [2, 1, 0].forEach((index) => {
        cy.findByTestId("results-card").within(() => {
          cy.findByTestId(`nominate-${json.Search[index].imdbID}`).click();
          cy.findByTestId(`nominate-${json.Search[index].imdbID}`).should(
            "not.be.enabled"
          );
        });
        cy.findByTestId("nominations-card")
          .findByTestId(`remove-${json.Search[index].imdbID}`)
          .should("be.enabled");
      });
      [0, 2, 1].forEach((index) => {
        cy.findByTestId("nominations-card").within(() => {
          cy.findByTestId(`remove-${json.Search[index].imdbID}`).click();
          cy.findByTestId(`remove-${json.Search[index].imdbID}`).should(
            "not.exist"
          );
        });
        cy.findByTestId("results-card")
          .findByTestId(`nominate-${json.Search[index].imdbID}`)
          .should("be.enabled");
      });
      cy.findByTestId("nominations-card")
        .findByText(NOMINATIONS_HEADER)
        .should("be.visible");
    });
  });
});
