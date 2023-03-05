import ContentHomeView from "./contentHomeView";
import arrow from "../../img/arrow.png";

const nextContent = document.querySelector(".navbar__next--content");

class MovieHomeView extends ContentHomeView {
  updateNav() {
    nextContent.innerHTML = `
        <span class="next__content--text next__content--movie">View TV Shows</span>
        <img src="${arrow}" alt=""/></a>
    `;
  }
}

export default new MovieHomeView();
