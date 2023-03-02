import View from "./view";
import film from "../../img/film.png";
import globe from "../../img/globe.png";
import arrow from "../../img/arrow.png";
import missing from "../../img/missing-img.svg";
import { DATE_OPTIONS } from "../config";
import paginationView from "./paginationView";

// GO BACK TO PREVIOUS PAGE USING HISTORY API (E.G window.history)
// CHECK IT OUT ON MDN

class MoviesPageView extends View {
  _parentEl = document.querySelector(".content__page--container");

  _generateMovieCast(data) {
    const actors = data.actors;

    if (actors.length === 0)
      return `
      <p>Main cast info not available</p>
    `;

    const actorsHTML = actors
      .map((actor) => {
        if (!actor.profile_path)
          return `
          <div class="content__page--cast-member">
            <img
              class="content__page--cast-image"
              src="${missing}"
              alt="Image of actor, ${actor.name}"
            />
            <h3 class="content__page--cast-name">${actor.name}</h3>
          </div>
        `;

        return `
        <div class="content__page--cast-member">
          <img
            class="content__page--cast-image"
            src="https://image.tmdb.org/t/p/w200${actor.profile_path}"
            alt="Image of actor, ${actor.name}"
          />
          <h3 class="content__page--cast-name">${actor.name}</h3>
        </div>
      `;
      })
      .join("");
    return actorsHTML;
  }

  // Generate movie recommdations markup
  _generateRecommendations(movie) {
    console.log(movie);
    const recommendations = movie.recommendations.movies;
    const data = recommendations
      .map((recommendation) => {
        if (!recommendation) return "";
        return `
        <a href="#${recommendation.id}">
          <div class="content__card content__card--recommendation">
            <div class="content__card--title">${recommendation.name}</div>
            <img
              class="content__card--image"
              src="${
                !(recommendation.image.slice(-4) === "null")
                  ? recommendation.image
                  : missing
              }" alt=""/>
          </div>
        </a>
        `;
      })
      .join("");
    return data;
  }

  _generateWatchProviders(movie) {
    const linkToTMDB = movie.watchProviders?.link;
    const providers = movie.watchProviders?.flatrate;
    if (!providers)
      return `
          <p class="after__streaming">Not on any Streaming Services</p>
          ${
            !linkToTMDB
              ? ""
              : `
            <a href="${linkToTMDB}" target="_blank">
              <button class="content__page--button content__page--buy">Find out where to buy/rent</button>
            </a>
          `
          }
          
        `;
    return providers
      .map((platform) => {
        return `
        <a class="content__page--watch-logo" href="${linkToTMDB}" target="_blank">
          <img src="https://image.tmdb.org/t/p/w200${platform.logo_path}" alt="${platform.provider_name} Logo"/>
        </a>`;
      })
      .join("");
  }

  _generateMarkup() {
    console.log(this._data);
    return `
    <div class="content__page">
      <a href="#" class="back__button--container">
        <button class="content__page--button back__button">
          <img class="content__page--button-icon" src="${arrow}" alt="" />
          Back to Movies
        </button>
      </a>
      <h1 class="content__page--title">${this._data.name}</h1>
      <div class="content__page--main">
        <img
          class="content__page--image"
          src="${
            this._data.image.slice(-4) === "null" ? missing : this._data.image
          }"
          alt=""
        />
        <div class="content__page-main--details">
          <img
            class="content__page--backdrop"
            src="${this._data.backdrop}"
            alt="${this._data.name} Backrop image"
          />
          <div class="content__page--summary">
            <div class="content__page--summary-left">
              <h2 class="content__page--heading">Movie Summary</h2>
              <p class="content__summary--text">
              ${this._data.summary}
              </p>
              <p class="content__page--genres">
                Genre(s): ${
                  this._data.genres.length === 0
                    ? "No info"
                    : this._data.genres.map((genre) => genre.name).join(", ")
                }
              </p>
            </div>
            <div class="content__page--watch content__page--summary-right">
              <h2 class="content__page--heading">Watch</h2>
              ${this._generateWatchProviders(this._data)}
              <div class="content__page--buttons">
                ${
                  !this._data.website
                    ? ""
                    : `<a href="${this._data.website}" target="_blank"
                  ><button class="content__page--button">
                    Website
                    <img
                      class="content__page--button-icon"
                      src="${globe}"
                      alt="globe icon"
                    /></button
                ></a>`
                }
                ${
                  this._data.trailer.slice(-9) === "undefined"
                    ? ""
                    : `<a href="${this._data.trailer}" target="_blank"
                  ><button class="content__page--button">
                    Trailer
                    <img
                      class="content__page--button-icon"
                      src="${film}"
                      alt="film icon"
                    /></button
                ></a>`
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content__page--misc">
        <div class="content__page--more-info">
          <h2 class="content__page--heading">More Info</h2>
          <ul>
            <li class="more__info--list-item">Director: ${
              !this._data.director ? "No info" : this._data.director
            }</li>
            <li class="more__info--list-item">Release Date: ${
              !this._data.releaseDate
                ? "No info"
                : new Date(this._data.releaseDate).toLocaleDateString(
                    navigator.language,
                    DATE_OPTIONS
                  )
            }</li>
            <li class="more__info--list-item">Runtime: ${
              !this._data.runtime ? "No info" : this._data.runtime + " mins"
            }</li>
            <li class="more__info--list-item">Budget: ${
              !this._data.budget
                ? "No info"
                : "$" + this._data.budget.toLocaleString(navigator.language)
            }</li>
            <li class="more__info--list-item">Revenue: ${
              !this._data.revenue
                ? "No info"
                : "$" + this._data.revenue.toLocaleString(navigator.language)
            }</li>
          </ul>
        </div>
        <div class="content__page--cast">
          <h2 class="content__page--heading">Main Cast</h2>
          <div class="content__page--cast-members">
            ${this._generateMovieCast(this._data)}
          </div>
        </div>
      </div>
      <div class="content__page--recommendations">
        ${
          this._data.recommendations.movies.length === 0
            ? ""
            : `<h1 class="content__page--heading">Recommendations based on ${this._data.name}</h1>`
        }
        <div class="content__page--recommendations-container">
          ${this._generateRecommendations(this._data)}
        </div>
      </div>
  </div>
  ${
    this._data.recommendations.total_pages < 2
      ? ""
      : paginationView.generateMarkup(this._data.recommendations)
  }

    `;
  }

  addHandlerRender(handler) {
    ["hashchange", "load"].forEach((event) =>
      window.addEventListener(event, handler)
    );
  }
}

export default new MoviesPageView();
