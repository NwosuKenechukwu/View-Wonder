import * as model from "./model.js";
import paginationView from "./views/paginationView.js";
import tvShowsHomeView from "./views/tvShowsHomeView.js";
import movieHomeView from "./views/movieHomeView.js";
import moviePageView from "./views/moviePageView.js";
const controlContentHome = async function () {
  await model.getTrending();
  movieHomeView.render(model.movie.search.trending);
  paginationView.addHandlerClick(controlPagination);
};

const controlContentPage = async function () {
  if (window.location.hash === "") {
    clearContent();
    movieHomeView.render(model.movie.search.trending);
    return;
  }
  const hash = window.location.hash.slice(1);
  const movie = await model.getMovie(hash);
  clearContent();
  moviePageView.render(movie);
  paginationView.addHandlerClick(controlPagination);
};

const controlPagination = async function (page, extraDataType) {
  clearContent();
  if (extraDataType.toLowerCase() === "trending") {
    await model.getTrending(page);
    movieHomeView.render(model.movie.search.trending);
  }

  if (extraDataType.toLowerCase() === "recommended") {
    await model.getRecommended(model.movie.search.recommended.id, page);
    moviePageView.render(model.movie.search.recommended);
  }
  paginationView.addHandlerClick(controlPagination);
};

const clearContent = function () {
  movieHomeView.clear();
  moviePageView.clear();
};

const init = async function () {
  await controlContentHome();

  window.addEventListener("mousedown", async function (e) {
    setTimeout(() => {
      if (e.button === 3 && window.location.hash === "") {
        this.window.history.back;
        clearContent();
        movieHomeView.render(model.movie.search.trending);
        paginationView.addHandlerClick(controlPagination);
      }
    }, 700);
  });

  // document.querySelector(".navbar__next--content")

  moviePageView.addHandlerRender(controlContentPage);
};

init();
