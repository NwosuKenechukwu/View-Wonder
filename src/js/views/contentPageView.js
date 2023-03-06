import View from "./view";
import missing from "../../img/missing-img.svg";

// GO BACK TO PREVIOUS PAGE USING HISTORY API (E.G window.history)
// CHECK IT OUT ON MDN

export default class ContentPageView extends View {
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
           <span class="tooltip">${actor.name}</span>
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
          <span class="tooltip">${actor.name}</span>
        </div>
      `;
      })
      .join("");
    return actorsHTML;
  }

  // Generate movie recommdations markup
  _generateRecommendations(movie) {
    const recommendations = movie.recommendations.results;
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

  addHandlerRender(handler) {
    ["hashchange", "load"].forEach((event) =>
      window.addEventListener(event, handler)
    );
  }
}
