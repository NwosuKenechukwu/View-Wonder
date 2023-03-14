import ContentPageView from "./contentPageView";
import film from "../../img/film.png";
import globe from "../../img/globe.png";
import arrow from "../../img/arrow.png";
import missing from "../../img/missing-img.svg";
import { DATE_OPTIONS } from "../config";
import paginationView from "./paginationView";

class TvShowsPageView extends ContentPageView {
  createdByInfo() {
    return this._data.createdBy.map((creator) => creator.name).join(", ");
  }

  _generateMarkup() {
    return `
    <div class="content__page">
      <a href="#" class="back__button--container">
        <button class="content__page--button back__button back__button--tv">
          <img class="content__page--button-icon" src="${arrow}" alt="" />
          Back to TV Shows
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
              ${
                !this._data.summary
                  ? "No summary available"
                  : this._data.summary
              }
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
              <h2 class="content__page--heading">Where to Watch</h2>
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
                  !this._data.trailer ||
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
            <li class="more__info--list-item">Created by: ${
              this._data.createdBy.length === 0
                ? "No info"
                : this.createdByInfo()
            }</li>
            <li class="more__info--list-item">First Aired: ${
              !this._data.firstAired
                ? "No info"
                : new Date(this._data.firstAired).toLocaleDateString(
                    navigator.language,
                    DATE_OPTIONS
                  )
            }
            </li>
            <li class="more__info--list-item">Last Aired: ${
              !this._data.lastAired
                ? "No info"
                : new Date(this._data.lastAired).toLocaleDateString(
                    navigator.language,
                    DATE_OPTIONS
                  )
            }
            </li>
            <li class="more__info--list-item">Runtime: ${
              !this._data.runtime ? "No info" : this._data.runtime + " mins"
            }
            </li>
            <li class="more__info--list-item">Number of Seasons: ${
              !this._data.numOfSeasons ? "No info" : this._data.numOfSeasons
            }
            </li>
            <li class="more__info--list-item">Ratings: ${
              !this._data.ratingAvg
                ? "No info"
                : this._data.ratingAvg +
                  " / 10" +
                  " (" +
                  this._data.ratingCount +
                  ")"
            }
            </li>
            <li class="more__info--list-item">Status: ${
              !this._data.status ? "No info" : this._data.status
            }
            </li>
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
          this._data.recommendations.contents.length === 0
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
      : paginationView.generateMarkup(this._data.recommendations, "recommended")
  }

    `;
  }
}

export default new TvShowsPageView();
