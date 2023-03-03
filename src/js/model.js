import { API_KEY } from "./config.js";

export const movie = {
  search: {
    trending: {},
    recommended: {},
    query: "",
  },
};

export const tvShow = {
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
    website: movie.homepage,
  };
};

const createBasicTvShowObject = function (show) {
  return {
    id: show.id,
    name: show.name,
    image: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
    backdrop: `https://image.tmdb.org/t/p/w500${
      show.backdrop_path || show.poster_path
    }`,
    ...(show.genres && { genres: show.genres }),
    ...(show.created_by?.[0].name && { createdBy: show.created_by }),
    summary: show.overview,
    firstAired: movie.first_air_date,
    lastAired: movie.last_air_date,
    runtime: show.episode_run_time,
    numOfSeasons: show.number_of_seasons,
    ratingAvg: show.vote_average,
    ratingCount: show.vote_count,
    website: show.website,
  };
};

const getCountry = async function () {
  const getIP = await fetch("https://ipinfo.io/json?token=446d3b225413ee");
  const ipJSON = await getIP.json();
  return ipJSON.country;
};

export const fetchAdditionalMovieData = async function (id) {
  try {
    const data = {};

    // Getting Trailer link
    const fetchTrailer = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
    );
    const trailerJSON = await fetchTrailer?.json();
    data.trailer = `https://www.youtube.com/watch?v=${trailerJSON.results[0]?.key}`;

    // Getting movie recommendations based on movie being viewed
    const fetchRecommendations = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}&page=1`
    );
    const fetchRecommendationsJSON = await fetchRecommendations.json();
    data.recommendations = {};
    data.recommendations.contents = fetchRecommendationsJSON.results?.slice(
      0,
      20
    );
    data.recommendations.page = fetchRecommendationsJSON.page;
    data.recommendations.total_pages = fetchRecommendationsJSON.total_pages;

    // Getting watch providers in user's country
    const fetchWatchProviders = await fetch(`
    https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`);
    const watchProvidersJSON = await fetchWatchProviders.json();
    const watchProviders = watchProvidersJSON.results;
    const country = await getCountry();
    data.watchProviders = watchProviders[country];

    // Getting Cast info and director's name
    const fetchCast = await fetch(
      `https://api.themoviedb.org/3/movie/${id}}/credits?api_key=${API_KEY}`
    );
    const castJSON = await fetchCast.json();
    const actors = castJSON.cast.splice(0, 14);
    const director = castJSON.crew.filter(
      (department, i) => castJSON.crew[i].job.toLowerCase() === "director"
    )[0]?.name;
    data.actors = actors;
    data.director = director;

    // if (trailerJSON.results.length === 0) return;
    return data;
  } catch (err) {
    console.error(err);
  }
};

const fetchAdditionalTvShowData = async function (id) {
  try {
    const data = {};

    // Getting movie recommendations based on tv show being viewed
    const fetchRecommendations = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${API_KEY}&page=1`
    );
    const fetchRecommendationsJSON = await fetchRecommendations.json();
    data.recommendations = {};
    data.recommendations.contents = fetchRecommendationsJSON.results?.slice(
      0,
      20
    );
    data.recommendations.page = fetchRecommendationsJSON.page;
    data.recommendations.total_pages = fetchRecommendationsJSON.total_pages;

    // Getting watch providers in user's country
    const fetchWatchProviders = await fetch(`
    https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=${API_KEY}`);
    const watchProvidersJSON = await fetchWatchProviders.json();
    const watchProviders = watchProvidersJSON.results;
    const country = await getCountry();
    data.watchProviders = watchProviders[country];

    // Getting Cast info and director's name
    const fetchCast = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}`
    );
    const castJSON = await fetchCast.json();
    const actors = castJSON.cast.splice(0, 14);
    data.actors = actors;
  } catch (error) {
    console.error(error);
  }
};

const createMovieObject = async function (movie) {
  const additionalData = await fetchAdditionalMovieData(movie.id);
  let data = createBasicMovieObject(movie);
  data = Object.assign(data, additionalData);
  return data;
};

const createTvShowObject = async function (show) {
  const additionalData = await fetchAdditionalTvShowData(show.id);
  let data = createBasicTvShowObject(show);
  data = Object.assign(data, additionalData);
  return data;
};

export const getMovie = async function (id) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
    );
    const data = await res.json();
    movie.search.recommended = await createMovieObject(data);
    movie.search.recommended.contentType = "movie";
    await getRecommended(id);

    return movie.search.recommended;
  } catch (error) {
    console.error(error);
  }
};

const getTvShow = async function (id) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`
    );
    const data = await res.json();
    tvShow.search.recommended = await createTvShowObject(data);
    tvShow.search.recommended.contentType = "tv";
    await getRecommended(id);

    return tvShow.search.recommended;
  } catch (error) {
    console.error(error);
  }
};

export const getContents = async function (
  url,
  query = "",
  contentType = "movie"
) {
  const res = await fetch(url);
  const data = await res.json();

  if (contentType.toLowerCase() === "movie") {
    const movies = await data.results.map((movie) =>
      createBasicMovieObject(movie)
    );
    if (query.toLowerCase() === "trending") {
      movie.search.trending.contentType = "movie";
      movie.search.trending.results = movies;
      movie.search.trending.page = data.page;
      movie.search.trending.total_pages = data.total_pages;
    }
    if (query.toLowerCase() === "recommended") {
      movie.search.recommended.recommendations.results = movies.slice(0, 20);
      movie.search.recommended.recommendations.page = data.page;
      movie.search.recommended.recommendations.total_pages = data.total_pages;
    }
  }

  if (contentType.toLowerCase() === "tv") {
    const shows = await data.results.map((show) =>
      createBasicTvShowObject(show)
    );
    console.log(shows);
    if (query.toLowerCase() === "trending") {
      tvShow.search.trending.contentType = "tv";
      tvShow.search.trending.results = shows;
      tvShow.search.trending.page = data.page;
      tvShow.search.trending.total_pages = data.total_pages;
    }
    if (query.toLowerCase() === "recommended") {
      tvShow.search.recommended.recommendations.results = shows.slice(0, 20);
      tvShow.search.recommended.recommendations.page = data.page;
      tvShow.search.recommended.recommendations.total_pages = data.total_pages;
    }
  }
};

export const getTrending = async function (page = 1, contentType = "tv") {
  try {
    await getContents(
      `https://api.themoviedb.org/3/trending/${contentType}/week?api_key=${API_KEY}&page=${page}`,
      "trending",
      contentType
    );
  } catch (error) {
    console.error(error);
  }
};

export const getRecommended = async function (
  id,
  page = 1,
  contentType = "movie"
) {
  try {
    await getContents(
      `https://api.themoviedb.org/3/${contentType}/${id}/recommendations?api_key=${API_KEY}&page=${page}`,
      "recommended",
      contentType
    );
  } catch (error) {
    console.error(error);
  }
};
