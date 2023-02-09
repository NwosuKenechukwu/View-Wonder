import * as model from "./model.js";
import moviesHomeView from "./views/moviesHomeView.js";

// render(getTrendingMovies, "TRENDING MOVIES");
const controlMovie = async function () {
  await model.getMoviesInCinemas();
  moviesHomeView.render(model.movie.search, "MOVIES IN CINEMAS");

  console.log(model.movie.search);
  await model.getTrendingMovies();
  moviesHomeView.generateTrendingCardHTML(model.movie.search);
};

controlMovie();
