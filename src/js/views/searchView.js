import ContentHomeView from "./contentHomeView";
import paginationView from "./paginationView";
import missing from "../../img/missing-img.svg";

const searchField = document.querySelector(".content__search");
const searchButton = document.querySelector(".content__search--submit");
let currPage = document.querySelector(".next__content--text");

class SearchView extends ContentHomeView {
  addListener(handler) {
    searchButton.addEventListener("click", function () {
      const query = searchField.value;
      currPage = document.querySelector(".next__content--text");
      const contentType = currPage.classList.contains("next__content--tv")
        ? "tv"
        : "movie";

      handler(query, 1, contentType);
    });
  }

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
          src="${
            content.image.slice(-4) === "null" ? missing : content.image
          }" alt=""/>
      </div>
    </a>
    `;
  }

  _generateCardHTML() {
    return this._data.results.map((el) => this._htmlCard(el)).join("");
  }

  _generateSectionMarkup(pageHeader) {
    paginationView.setData(this._data);
    const contentCards = this._generateCardHTML();
    const html = `
    <div class="section__container">
      ${this._generateHeader(pageHeader)}
      <div class="content__home--section">
      ${contentCards}
      </div>
    </div>
    ${paginationView.generateMarkup(this._data, "search")}
    `;
    return html;
  }

  _generateMarkup() {
    const html = this._generateSectionMarkup(
      `Search results for ${this._data.query}`
    );
    return html;
  }
}

export default new SearchView();
