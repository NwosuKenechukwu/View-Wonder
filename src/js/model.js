export const movie = {
  info: {},
  search: {
    trending: {},
    recommended: {},
    query: "",
  },
};

const createBasicMovieObject = function (movie) {
  return {
    id: movie.id,
    name: movie.title,
    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    backdrop: `https://image.tmdb.org/t/p/w500${
      movie.backdrop_path || movie.poster_path
    }`,
    ...(movie.genres && { genres: movie.genres }),
    summary: movie.overview,
    releaseDate: movie.release_date,
    runtime: movie.runtime,
    ratingAvg: movie.vote_average,
    ratingCount: movie.vote_count,
    budget: movie.budget,
    revenue: movie.revenue,
    ...(movie.page && { page: movie.page }),
    ...(movie.total_pages && { total_pages: movie.total_pages }),
  };
};

const getCountry = async function () {
  const getIP = await fetch("https://ipinfo.io/json?token=446d3b225413ee");
  const ipJSON = await getIP.json();
  return ipJSON.country;
};

export const fetchAdditionalData = async function (id) {
  try {
    const data = {};

    // Getting Trailer link
    const fetchTrailer = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=3f6d9f5e8287d95865bcc38f8bd1cbd2&language=en-US`
    );
    const trailerJSON = await fetchTrailer?.json();
    data.trailer = `https://www.youtube.com/watch?v=${trailerJSON.results[0]?.key}`;

    // Getting movie recommendations based on movie being viewed
    await getRecommended(id);

    data.recommendations = {};
    data.recommendations.movies = movie.search.recommended.results.slice(0, 20);
    data.recommendations.page = movie.search.recommended.page;
    data.recommendations.total_pages = movie.search.recommended.total_pages;

    // Getting watch providers in user's country
    const fetchWatchProviders = await fetch(`
    https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=3f6d9f5e8287d95865bcc38f8bd1cbd2`);
    const watchProvidersJSON = await fetchWatchProviders.json();
    const watchProviders = watchProvidersJSON.results;
    const country = await getCountry();
    data.watchProviders = watchProviders[country];

    // Getting Cast info and director's name
    const fetchCast = await fetch(
      `https://api.themoviedb.org/3/movie/${id}}/credits?api_key=3f6d9f5e8287d95865bcc38f8bd1cbd2&language=en-US`
    );
    const castJSON = await fetchCast.json();
    const actors = castJSON.cast.splice(0, 14);
    const director = castJSON.crew.filter(
      (department, i) => castJSON.crew[i].job.toLowerCase() === "director"
    )[0]?.name;
    data.actors = actors;
    data.director = director;

    // Getting Website
    const fetchWebsite = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=3f6d9f5e8287d95865bcc38f8bd1cbd2`
    );
    const websiteJSON = await fetchWebsite.json();
    data.website = websiteJSON.homepage;

    // if (trailerJSON.results.length === 0) return;
    return data;
  } catch (err) {
    console.error(err);
  }
};

const createMovieObject = async function (movie) {
  const additionalData = await fetchAdditionalData(movie.id);
  let data = createBasicMovieObject(movie);
  data = Object.assign(data, additionalData);
  return data;
};

export const getMovie = async function (id) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=3f6d9f5e8287d95865bcc38f8bd1cbd2`
    );
    const data = await res.json();
    return createMovieObject(data);
  } catch (error) {
    console.error(error);
  }
};

export const getMovies = async function (url, query = "") {
  const res = await fetch(url);
  const data = await res.json();

  const movies = await data.results.map((movie) =>
    createBasicMovieObject(movie)
  );

  if (query.toLowerCase() === "trending") {
    movie.search.trending.results = movies;
    movie.search.trending.page = data.page;
    movie.search.trending.total_pages = data.total_pages;
  }
  if (query.toLowerCase() === "recommended") {
    movie.search.recommended.results = movies;
    movie.search.recommended.page = data.page;
    movie.search.recommended.total_pages = data.total_pages;
  }

  return movies;
};

export const getTrending = async function (page = 1) {
  try {
    await getMovies(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=3f6d9f5e8287d95865bcc38f8bd1cbd2&page=${page}`,
      "trending"
    );
  } catch (error) {
    console.error(error);
  }
};

export const getRecommended = async function (id, page = 1) {
  try {
    await getMovies(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=3f6d9f5e8287d95865bcc38f8bd1cbd2&language=en-US&page=1`,
      "recommended"
    );
  } catch (error) {
    console.error(error);
  }
};
