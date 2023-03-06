import { API_KEY } from "./config.js";

export const movie = {
  trending: {},
  recommended: {},
};

export const tvShow = {
  trending: {},
  recommended: {},
};

export const search = {};

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
    ...(show.created_by && { createdBy: show.created_by }),
    ...(show.status && { status: show.status }),
    summary: show.overview,
    firstAired: show.first_air_date,
    lastAired: show.last_air_date,
    runtime: show.episode_run_time,
    numOfSeasons: show.number_of_seasons,
    ratingAvg: show.vote_average,
    ratingCount: show.vote_count,
    website: show.homepage,
  };
};

const createSearchResult = function (result, contentType) {
  if (contentType === "movie")
    return {
      id: result.id,
      name: result.title,
      image: `https://image.tmdb.org/t/p/w500${result.poster_path}`,
    };
  return {
    id: result.id,
    name: result.name,
    image: `https://image.tmdb.org/t/p/w500${result.poster_path}`,
  };
};

const getCountry = async function () {
  try {
    const getIP = await fetch("https://ipinfo.io/json?token=446d3b225413ee");
    const ipJSON = await getIP.json();
    return ipJSON.country;
  } catch (error) {
    console.error(error);
  }
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

    return data;
  } catch (error) {
    console.error(error);
  }
};

const createMovieObject = async function (movie) {
  try {
    const additionalData = await fetchAdditionalMovieData(movie.id);
    let data = createBasicMovieObject(movie);
    data = Object.assign(data, additionalData);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const createTvShowObject = async function (show) {
  try {
    const additionalData = await fetchAdditionalTvShowData(show.id);
    let data = createBasicTvShowObject(show);
    data = Object.assign(data, additionalData);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getMovie = async function (id) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
    );
    const data = await res.json();
    movie.recommended = await createMovieObject(data);
    movie.recommended.contentType = "movie";
    await getRecommended(id, 1, "movie");

    return movie.recommended;
  } catch (error) {
    console.error(error);
  }
};

export const getTvShow = async function (id) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`
    );
    const data = await res.json();
    tvShow.recommended = await createTvShowObject(data);
    tvShow.recommended.contentType = "tv";
    await getRecommended(id, 1, "tv");

    return tvShow.recommended;
  } catch (error) {
    console.error(error);
  }
};

export const getContents = async function (url, query = "", contentType) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (contentType.toLowerCase() === "movie") {
      const movies = await data.results.map((movie) =>
        createBasicMovieObject(movie)
      );

      if (query.toLowerCase() === "trending") {
        movie.trending.contentType = "movie";
        movie.trending.results = movies;
        movie.trending.page = data.page;
        movie.trending.total_pages = data.total_pages;
      }

      if (query.toLowerCase() === "recommended") {
        movie.recommended.recommendations.results = movies.slice(0, 20);
        movie.recommended.recommendations.page = data.page;
        movie.recommended.recommendations.total_pages = data.total_pages;
      }
    }

    if (contentType.toLowerCase() === "tv") {
      const shows = await data.results.map((show) =>
        createBasicTvShowObject(show)
      );

      if (query.toLowerCase() === "trending") {
        tvShow.trending.contentType = "tv";
        tvShow.trending.results = shows;
        tvShow.trending.page = data.page;
        tvShow.trending.total_pages = data.total_pages;
      }

      if (query.toLowerCase() === "recommended") {
        tvShow.recommended.recommendations.results = shows.slice(0, 20);
        tvShow.recommended.recommendations.page = data.page;
        tvShow.recommended.recommendations.total_pages = data.total_pages;
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const getSearchContents = async function (url, query = "", contentType) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    const searchResults = await data.results.map((result) =>
      createSearchResult(result, contentType)
    );

    (search.query = query), (search.contentType = contentType);
    search.results = searchResults.slice(0, 20);
    search.page = data.page;
    search.total_pages = data.total_pages;
    search.category = "search";
  } catch (error) {
    console.error(error);
  }
};

export const getTrending = async function (page = 1, contentType) {
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

export const getRecommended = async function (id, page = 1, contentType) {
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

export const getSearchResults = async function (
  query = "",
  page = 1,
  contentType
) {
  try {
    await getSearchContents(
      `https://api.themoviedb.org/3/search/${contentType}?api_key=${API_KEY}&query=${query}&page=${page}`,
      query,
      contentType
    );
  } catch (error) {
    console.error(err);
  }
};
