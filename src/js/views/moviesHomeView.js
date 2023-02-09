import View from "./view";

class MoviesHomeViews extends View {
  _parentEl = document.querySelector(".container");

  _generateCardHTML() {
    return this._data.map((el) => this._htmlCard(el)).join("");
  }

  generateTrendingCardHTML(data) {
    this._data = data;
    console.log(data);
    const title = this._generateTitle("TRENDING MOVIES");
    const html = this._generateCardHTML();
    const fullHTML = `
    <div class="divider"></div>
      ${title}
      <div class="container">
        ${html}
      </div>
    `;

    this._parentEl.insertAdjacentHTML("afterend", fullHTML);
  }

  _htmlCard(el) {
    return `
      <div class="movie__card">
        <div class="movie__card--title">${el.name}</div>
        <img
          class="movie__card--image"
          src="${el.image}" alt=""/>
      </div>
    `;
  }

  _generateTitle(pageTitle = "") {
    return `
    <h1 class="descriptorTitle">${pageTitle}</h1>
    `;
  }
}

export default new MoviesHomeViews();
