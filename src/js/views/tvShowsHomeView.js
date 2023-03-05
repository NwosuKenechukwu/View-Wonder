import contentHomeView from "./contentHomeView";
import arrow from "../../img/arrow.png";

const nextContent = document.querySelector(".navbar__next--content");

class TvShowsHomeView extends contentHomeView {
  updateNav() {
    nextContent.innerHTML = `
        <span class="next__content--text next__content--tv">View Movies</span>
        <img src="${arrow}" alt=""/></a>
    `;
  }
}

export default new TvShowsHomeView();
