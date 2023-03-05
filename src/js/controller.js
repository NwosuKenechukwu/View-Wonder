import * as model from "./model.js";
import paginationView from "./views/paginationView.js";
import tvShowsHomeView from "./views/tvShowsHomeView.js";
import tvShowsPageView from "./views/tvShowsPageView.js";
import movieHomeView from "./views/movieHomeView.js";
import moviePageView from "./views/moviePageView.js";
import searchView from "./views/searchView.js";

const controlContentHome = async function () {
  await model.getTrending(1, "movie");
  movieHomeView.setData(model.movie.trending);
  movieHomeView.render();
  paginationView.addHandlerClick(controlPagination);
};

const controlContentPage = async function () {
  const contentType = paginationView.getContentType();
  if (contentType === "movie") {
    if (window.location.hash === "") {
      clearContent();
      movieHomeView.setData(model.movie.trending);
      movieHomeView.render();
      return;
    }
    const hash = window.location.hash.slice(1);
    const movie = await model.getMovie(hash);
    clearContent();
    moviePageView.setData(movie);
    moviePageView.render();
    paginationView.addHandlerClick(controlPagination);
  }

  if (contentType === "tv") {
    if (window.location.hash === "") {
      clearContent();
      tvShowsHomeView.setData(model.tvShow.trending);
      tvShowsHomeView.render();
      return;
    }
    const hash = window.location.hash.slice(1);
    const show = await model.getTvShow(hash);
    clearContent();
    tvShowsPageView.setData(show);
    tvShowsPageView.render();
    paginationView.addHandlerClick(controlPagination);
  }
};

const controlPagination = async function (page, extraDataType) {
  const contentType = paginationView.getContentType();
  clearContent();
  if (extraDataType.toLowerCase() === "trending") {
    if (contentType === "movie") {
      await model.getTrending(page, contentType);
      movieHomeView.setData(model.movie.trending);
      movieHomeView.render();
    }
    if (contentType === "tv") {
      await model.getTrending(page, contentType);
      tvShowsHomeView.setData(model.tvShow.trending);
      tvShowsHomeView.render();
    }
  }

  if (extraDataType.toLowerCase() === "recommended") {
    if (contentType === "movie") {
      await model.getRecommended(model.movie.recommended.id, page, "movie");
      moviePageView.setData(model.movie.recommended);
      moviePageView.render();
    }

    if (contentType === "tv") {
      await model.getRecommended(model.tvShow.recommended.id, page, "tv");
      moviePageView.setData(model.tvShow.recommended);
      moviePageView.render();
    }
  }
  paginationView.addHandlerClick(controlPagination);
};

const controlSearch = async function (query, page, contentType) {
  await model.getSearchResults(query, page, contentType);
  clearContent();
  searchView.setData(model.search);
  searchView.render();
  paginationView.addHandlerClick(controlPagination);
};

const clearContent = function () {
  movieHomeView.clear();
  moviePageView.clear();
  searchView.clear();
};

const init = async function () {
  let contentTypeForNav = "tv";

  await controlContentHome();
  searchView.addListener(controlSearch);

  window.addEventListener("mousedown", async function (e) {
    setTimeout(() => {
      if (e.button === 3 && window.location.hash === "") {
        this.window.history.back;
        clearContent();
        if (contentTypeForNav === "tv") {
          movieHomeView.setData(model.movie.trending);
          movieHomeView.render();
        }
        if (contentTypeForNav === "movie") {
          tvShowsHomeView.setData(model.tvShow.trending);
          tvShowsHomeView.render();
        }
        paginationView.addHandlerClick(controlPagination);
      }
    }, 700);
  });

  document
    .querySelector(".navbar__next--content")
    .addEventListener("click", async function (e) {
      e.preventDefault();
      if (contentTypeForNav === "tv") {
        await model.getTrending(1, "tv");
        clearContent();
        tvShowsHomeView.setData(model.tvShow.trending);
        tvShowsHomeView.render();
        tvShowsHomeView.updateNav();
        paginationView.addHandlerClick(controlPagination);
        contentTypeForNav = "movie";
        return;
      }

      if (contentTypeForNav === "movie") {
        await model.getTrending(1, "movie");
        clearContent();
        movieHomeView.setData(model.movie.trending);
        movieHomeView.render();
        movieHomeView.updateNav();
        paginationView.addHandlerClick(controlPagination);
        contentTypeForNav = "tv";
        return;
      }
    });

  moviePageView.addHandlerRender(controlContentPage);
};

init();
