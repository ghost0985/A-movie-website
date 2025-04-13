// https://www.omdbapi.com/?apikey=e712e7eb&s=TitleOfMovie
const input = document.querySelector(".search__box");
const resultsContainer = document.getElementById("results");

if (!input) {
  console.error("Search input not found.");
} else {
  let Timer;

  input.addEventListener("input", function() {
    clearTimeout(Timer);

    Timer = setTimeout(() => {
      const query = input.value.trim();
      if (!query) {
        resultsContainer.innerHTML = "";
        return;
      }

      const apiURL = `https://www.omdbapi.com/?apikey=e712e7eb&s=${encodeURIComponent(
        query
      )}`;

      fetch(apiURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          resultsContainer.innerHTML = "";

          if (data.Search) {
            data.Search.forEach(function (movie) {
              fetch(
                "https://www.omdbapi.com/?apikey=e712e7eb&i=" +
                  movie.imdbID +
                  "&plot=short"
              )
                .then(function (res) {
                  return res.json();
                })
                .then(function (details) {
                  let div = document.createElement("div");
                  div.classList.add("result__item");

                  div.innerHTML = `
                    <div class="movie__card">
                        <img src="${
                          movie.Poster !== "N/A"
                            ? movie.Poster
                            : "https://via.placeholder.com/100x150"
                        }"
                                alt="${movie.Title}" class="movie__poster" />
                        <div class="movie__info">
                            <strong class="movie__title">${movie.Title}</strong>
                            <p class="movie__plot">${details.Plot}</p>
                            <span class="movie__year">(${movie.Year})</span>
                        </div>
                    </div>
                `;
                  resultsContainer.appendChild(div);
                });
            });
          } else {
            resultsContainer.innerHTML =
              "<div class='no__results'>No results found.</div>";
          }
        })
        .catch(function (error) {
          console.log("somthing went wrong", error);
        });
    }, 300);
  });
}

