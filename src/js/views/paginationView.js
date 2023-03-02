import View from "./view";
import arrow from "../../img/arrow.png";

class PaginationView extends View {
  _parentEl = "";

  addHandlerClick(handler) {
    this._parentEl = document.querySelector(".pagination");
    this._parentEl.addEventListener("click", function (e) {
      e.preventDefault();
      const btnClick = e.target.closest(".content__page--button");

      if (!btnClick) return;

      const currPage = +btnClick.dataset.goto;
      console.log(currPage);
      handler(currPage);
    });
  }

  generateMarkup(data) {
    const currPage = data.page;
    const pages = data.total_pages;
    console.log(currPage, pages);

    if (pages <= 1)
      return `
        <div class="pagination only__page">
          <p class="current__page">${currPage}</p>
        </div>
        `;

    if (currPage === 1 && pages > 1) {
      return `
        <div class="pagination first__page">
          <p class="current__page current__page--first">${currPage}</p>
          <button class="next__page content__page--button" data-goto="${
            currPage + 1
          }">
            Page ${currPage + 1} <img src="${arrow}" alt="" />
          </button>
        </div>
      `;
    }

    if (currPage !== 1 && pages > 1 && currPage !== pages) {
      return `
        <div class="pagination">
          <button class="previous__page content__page--button" data-goto="${
            currPage - 1
          }">
            <img src="${arrow}" alt="" /> Page ${currPage - 1}
          </button>
          <p class="current__page">${currPage}</p>
          <button class="next__page content__page--button" data-goto="${
            currPage + 1
          }">
            Page ${currPage + 1} <img src="${arrow}" alt="" />
          </button>
        </div>
    `;
    }

    if (pages > 1 && currPage === pages) {
      return `
        <div class="pagination last__page">
          <button class="previous__page content__page--button" data-goto="${
            currPage - 1
          }">
            <img src="${arrow}" alt="" /> Page ${currPage - 1}
          </button>
          <p class="current__page current__page--last">${currPage}</p>
        </div>
      `;
    }
  }
}

export default new PaginationView();
