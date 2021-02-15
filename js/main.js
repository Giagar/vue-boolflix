/* TO DO
_check all notes (?? and !!)

_?? move the filters creation before the query ??
*/

new Vue({
  el: "#root",

  data: {
    apiKey: "ce3b6870fdfccf78b80dcdd8f1af7e7c",
    baseUrl: "https://api.themoviedb.org/3/",
    queryValidation: {value: false, errorMessage: ""},

    searchByTerm: "",
    searchByTermResults: "",

    // more info displayed
    cast: "",
    allGenres: [],
    selectedGenre: "",
    categories: ["movie", "tv"],
    selectedCategory: "",
  },

  methods: {
    queryDatabase() {
      // resetting in order to avoid ghosting in certain cases of consequent multiple queries
      this.searchByTermResults = "";

      // validating the input: is it empty? Does it start with a space?
      this.searchByTerm === "" || /^\s+/.test(this.searchByTerm) ? (
        this.queryValidation.value = false, 
        this.queryValidation.errorMessage = "Inserire un termine di ricerca"
        ) : (
        this.queryValidation.value = true, 
        this.queryValidation.errorMessage = ""
      )

      // retrieving data from the database
      axios
        .all([
          axios.get(
              `${this.baseUrl}search/movie?`, 
              {
                params: {
                  api_key: this.apiKey,
                  query: this.searchByTerm,
                }
              }
          ),
          axios.get(
            `${this.baseUrl}search/tv?`, 
            {
              params: {
                api_key: this.apiKey,
                query: this.searchByTerm,
              },
            }
          ),

          // get movie genres list
          axios.get(
            `${this.baseUrl}genre/movie/list?`, 
            {
              params: {
                api_key: this.apiKey,
              }
            }
          ),
          // get series genres list
          axios.get(
            `${this.baseUrl}genre/tv/list?`, 
            {
              params: {
                api_key: this.apiKey,
              }
            }
          ),
        ])
        .then(([resMovie, resTv, resMovieGenresList, resTvGenresList]) => {
          let resAll = resMovie.data.results.concat(resTv.data.results); // array

          // validating the response: do we get a response for the query?
          resAll.length === 0 ? (
              this.queryValidation.value = false, 
              this.queryValidation.errorMessage = "Nessun risultato per il termine di ricerca"
              ) : (
              this.queryValidation.value = true, 
              this.queryValidation.errorMessage = ""
            )

          let resAllGenres = [
            ...resMovieGenresList.data.genres,
            ...resTvGenresList.data.genres,
          ];

          // genres select
          this.allGenres = [...resAllGenres];

          // ?? check for duplicates ??

          // genres: from codes to names
          resAll.forEach((movie) => {
            // bonus: adding the prop category to select between movies and tv series
            movie.category = movie.title ? "movie" : "tv";
            // _/bonus

            movie.genre_ids = movie.genre_ids.map((genreCodes) => {
              if (movie.genre_ids === []) {
                movie.genre_ids = "No genre specified";
              } else {
                return (
                  "genres",
                  resAllGenres.filter(
                    (genreNames) => genreCodes === genreNames.id
                  )[0].name
                );
              }
            });
          });

          // checking for missing poster images and setting a default cover img
          resAll.forEach((obj) => {
            // ?? va bene passare true per nn fargli fare niente - (l'assegnazione funziona, ma il percorso è sbagliato) ??
            obj.poster_path
              ? true
              : (obj.poster_path = "./img-fallback/default-cover.png");
          });

          this.searchByTermResults = resAll;

          // empty the search field
          this.searchByTerm = "";
        })
        // cathcing errors different from 422 (query = "")
        .catch(err => {
          if(err.response.status !== 200 && err.response.status !== 422) {
            this.queryValidation.value = false,
            this.queryValidation.errorMessage = "Abbiamo riscontrato un problema tecnico. Riprova più tardi."
          }
        });
    },

    // render a gb flag when the value passed is
    displayGBFlag(movie) {
      return `./flags/${
        movie.original_language === "en" ? "gb" : movie.original_language
      }.svg`;
    },

    // display original title only if it is different from the title (both movies and series)
    displayOriginalTitle(movie) {
      return (
        movie.original_title !== movie.title ||
        movie.original_name !== movie.name
      );
    },

    // display filled or empty stars depending on the movie score
    displayStars(star, movie) {
      return `vote fa-star ${
        star <= Math.ceil(movie.vote_average / 2) ? "fas" : "far"
      }`;
    },

    // get more data: actors and genre (max: 2 items)
    displayMoreInfo(movie) {
      this.cast = "Loading...";

      // get actors
      axios
        .get(
          "https://api.themoviedb.org/3/movie/" +
            movie.id +
            "/credits?api_key=ce3b6870fdfccf78b80dcdd8f1af7e7c"
        )
        .then((res) => {
          res = res.data.cast;
          this.cast = res
            .map((actor) => actor.name)
            .slice(0, 5) // number of actors displayed
            .join(", ");
        });
    },

    // cut the description if larger than a defined length and add ... at the end
    displayDescription(str, maxLength) {
      return str.length > maxLength ? str.slice(0, maxLength - 3) + "..." : str;
    },

    // reset filters
    resetFilters() {
      this.selectedGenre = "";
      this.selectedCategory = "";
    }
  },

  mounted: function () {
    // ?? get movie's genres list and actors here ??
  },
});
