export const movie = {
  info: {},
  search: [],
};

export const getMovie = async function (url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getMovies = async function (url) {
  const res = await fetch(url);
  const data = await res.json();

  movie.search = data.results.map((movie) => movie.genres);

  const movies = data.results.map((movie) => {
    return {
      id: movie.id,
      name: movie.title,
      image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      genres: movie.genres,
      summary: movie.overview,
      releaseDate: movie.releaseDate,
      runtime: movie.runtime,
      ratingAvg: movie.vote_average,
      ratingCount: movie.vote_count,
      budget: movie.budget,
      revenue: movie.revenue,
    };
  });
  return movies;
};

export const getTrendingMovies = async function () {
  try {
    const res = await getMovies(
      "https://api.themoviedb.org/3/trending/movie/week?api_key=3f6d9f5e8287d95865bcc38f8bd1cbd2"
    );
    movie.search = res;
  } catch (error) {
    console.error(error);
  }
};

export const getMoviesInCinemas = async function () {
  try {
    const res = await getMovies(
      "https://api.themoviedb.org/3/movie/upcoming?api_key=3f6d9f5e8287d95865bcc38f8bd1cbd2&language=en-GB&page=1"
    );

    movie.search = res;
  } catch (error) {
    console.error(error);
  }
};
