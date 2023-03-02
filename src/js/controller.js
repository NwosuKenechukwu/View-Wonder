import * as model from "./model.js";
import moviesPageView from "./views/moviesPageView.js";
import moviesHomeView from "./views/moviesHomeView.js";
import paginationView from "./views/paginationView.js";

const controlContentHome = async function () {
  await model.getTrending();

  moviesHomeView.render(model.movie.search.trending);
};

const controlContentPage = async function () {
  const hash = window.location.hash.slice(1);
  const movie = await model.getMovie(hash);

  moviesHomeView.clear();
  moviesPageView.clear();
  moviesPageView.render(movie);
  paginationView.addHandlerClick(controlPagination);
};

const getPaginationData = async function (section = "") {
  if (section === "recommended") await model.getRecommended();
  moviesPageView.r;
};

const controlPagination = async function (page, contentType, extraDataType) {
  clearContent();
  if (extraDataType.toLowerCase() === "trending") {
    await model.getTrending(page);
    moviesHomeView.render(model.movie.search.trending);
  }

  if (extraDataType.toLowerCase() === "recommended") {
    await model.getRecommended(page);
    moviesPageView.render(model.movie.search.recommended);
  }
  paginationView.addHandlerClick(controlPagination);
};

const clearContent = function () {
  moviesHomeView.clear();
};

const init = async function () {
  await controlContentHome();

  moviesPageView.addHandlerRender(controlContentPage);
  paginationView.addHandlerClick(controlPagination);
};

init();
