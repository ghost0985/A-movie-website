// https://www.omdbapi.com/?apikey=e712e7eb&s=TitleOfMovie
const sortSelect = document.getElementById("sortSelect");
const input = document.querySelector(".search__box");
const resultsContainer = document.getElementById("results");

let lastResults = [];

if (!input) {
  console.log("Search input not found");
} else {
  let timer;

  input.addEventListener("input", function () {
    clearTimeout(timer);

    timer = setTimeout(function () {
      let query = input.value.trim();
      if (query === "") {
        resultsContainer.innerHTML = "";
        return;
      }

      let url = "https://www.omdbapi.com/?apikey=e712e7eb&s=" + encodeURIComponent(query);

      fetch(url)
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          if (data.Search) {
            lastResults = data.Search.slice();
            sortAndShowResults();
          } else {
            resultsContainer.innerHTML = "<div>No results found.</div>";
          }
        })
        .catch(function (err) {
          console.log("error:", err);
        });
    }, 300);
  });

  sortSelect.addEventListener("change", function () {
    if (lastResults.length > 0) {
      sortAndShowResults();
    }
  });
}

function sortAndShowResults() {
  resultsContainer.innerHTML = "";

  let sortType = sortSelect.value;
  let sorted = lastResults.slice();

  sorted.sort(function (a, b) {
    let yearA = getYear(a.Year);
    let yearB = getYear(b.Year);

    if (sortType === "by__nameAZ") {
      return a.Title.localeCompare(b.Title);
    } else if (sortType === "by__nameZA") {
      return b.Title.localeCompare(a.Title);
    } else if (sortType === "by__yearNO") {
      return yearB - yearA;
    } else if (sortType === "by__yearON") {
      return yearA - yearB;
    } else {
      return 0;
    }
  });

  if (sortType === "by__nameAZ") {
    return a.Title.localeCompare(b.Title);
  } else if (sortType === "by__nameZA") {
    return b.Title.localeCompare(a.Title);
  }

  let promises = [];

  for (let i = 0; i < sorted.length; i++) {
    let movie = sorted[i];
    let movieUrl = "https://www.omdbapi.com/?apikey=e712e7eb&i=" + movie.imdbID + "&plot=short";

    let p = fetch(movieUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (details) {
        return { movie: movie, details: details };
      });

    promises.push(p);
  }

  Promise.all(promises).then(function (allResults) {
    for (let j = 0; j < allResults.length; j++) {
      let item = allResults[j];
      let movie = item.movie;
      let details = item.details;

      let div = document.createElement("div");
      div.className = "result__item";

      div.innerHTML = `
        <div class="movie__card">
          <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/100x150"}"
               alt="${movie.Title}" class="movie__poster" />
          <div class="movie__info">
            <strong class="movie__title">${movie.Title}</strong>
            <p class="movie__plot">${details.Plot}</p>
            <span class="movie__year">(${movie.Year})</span>
          </div>
        </div>
      `;

      resultsContainer.appendChild(div);
    }
  });
}

function getYear(str) {
  if (!str) return 0;
  let match = str.match(/\d{4}/);
  if (match) {
    return parseInt(match[0]);
  } else {
    return 0;
  }
}

