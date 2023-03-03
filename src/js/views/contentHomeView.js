import paginationView from "./paginationView";
import View from "./view";

export default class ContentHomeView extends View {
  _parentEl = document.querySelector(".content__home--container");

  _generateHeader(pageHeader = "") {
    return `
    <h1 class="section__title">${pageHeader}</h1>
    `;
  }

  _htmlCard(content) {
    return `
    <a href="#${content.id}">
      <div class="content__card">
        <div class="content__card--title">${content.name}</div>
        <img
          class="content__card--image"
          src="${content.image}" alt=""/>
      </div>
    </a>
    `;
  }

  _generateCardHTML() {
    console.log(this._data);
    return this._data.results.map((el) => this._htmlCard(el)).join("");
  }

  _generateSectionMarkup(pageHeader) {
    const contentCards = this._generateCardHTML();
    const html = `
    <div class="trending__container">
      ${this._generateHeader(pageHeader)}
      <div class="content__home--section">
      ${contentCards}
      </div>
    </div>
    ${paginationView.generateMarkup(this._data, "trending")}
    `;
    return html;
  }

  _generateMarkup() {
    const html = this._generateSectionMarkup(
      `Trending ${this._data.contentType === "movie" ? "Movies" : "TV Shows"}`
    );
    return html;
  }
}
