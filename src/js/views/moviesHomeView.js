import paginationView from "./paginationView";
import View from "./view";

class MoviesHomeViews extends View {
  _parentEl = document.querySelector(".content__home--container");

  _generateHeader(pageHeader = "") {
    return `
    <h1 class="section__title">${pageHeader}</h1>
    `;
  }

  _htmlCard(movie) {
    return `
    <a href="#${movie.id}">
      <div class="content__card">
        <div class="content__card--title">${movie.name}</div>
        <img
          class="content__card--image"
          src="${movie.image}" alt=""/>
      </div>
    </a>
    `;
  }

  _generateCardHTML() {
    return this._data.results.map((el) => this._htmlCard(el)).join("");
  }

  _generateSectionMarkup(pageHeader) {
    const movieCards = this._generateCardHTML();
    const html = `
    <div class="trending__container">
      ${this._generateHeader(pageHeader)}
      <div class="content__home--section">
      ${movieCards}
      </div>
      ${paginationView.generateMarkup(this._data)}
    </div>
    `;
    return html;
  }

  _generateMarkup(section) {
    const html = this._generateSectionMarkup("Trending Movies");
    return html;
  }
}

export default new MoviesHomeViews();
