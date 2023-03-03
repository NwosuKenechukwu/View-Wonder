import View from "./view";
import arrow from "../../img/arrow.png";

class PaginationView extends View {
  _parentEl = "";

  addHandlerClick(handler) {
    this._parentEl = document.querySelector(".pagination");
    if (!this._parentEl) return;
    this._parentEl.addEventListener("click", function (e) {
      e.preventDefault();
      const btnClick = e.target.closest(".content__page--button");

      const extraDataType = document
        .querySelector(".pagination")
        .classList.contains("trending")
        ? "trending"
        : "recommended";

      if (!btnClick) return;

      const currPage = +btnClick.dataset.goto;

      handler(currPage, extraDataType);
    });
  }

  generateMarkup(data, extraDataType) {
    const currPage = data.page;
    const pages = data.total_pages;

    if (pages <= 1)
      return `
        <div class="pagination ${extraDataType} only__page">
          <p class="current__page">${currPage}</p>
        </div>
        `;

    if (currPage === 1 && pages > 1) {
      return `
        <div class="pagination ${extraDataType} first__page">
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
        <div class="pagination ${extraDataType}">
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
        <div class="pagination ${extraDataType} last__page">
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
