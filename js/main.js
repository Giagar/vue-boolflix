/* TO DO
_sort out overview length

_Refactoring
__delete all temporary stuff (include TEMP in the name)

_check all notes (?? and !!)

_tackle the scrollbar x always present
-add a filters reset button

_?? move the filters creation before the query ??
*/

new Vue({
  el: "#root",

  data: {
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
      // retrieving data from the database
      axios
        .all([
          axios.get(
            "https://api.themoviedb.org/3/search/movie?api_key=ce3b6870fdfccf78b80dcdd8f1af7e7c&query=" +
              this.searchByTerm
          ),
          axios.get(
            "https://api.themoviedb.org/3/search/tv?api_key=ce3b6870fdfccf78b80dcdd8f1af7e7c&query=" +
              this.searchByTerm
          ),

          // get movie genres list
          axios.get(
            "https://api.themoviedb.org/3/genre/movie/list?api_key=ce3b6870fdfccf78b80dcdd8f1af7e7c&language=en-US"
          ),
          // get series genres list
          axios.get(
            "https://api.themoviedb.org/3/genre/tv/list?api_key=ce3b6870fdfccf78b80dcdd8f1af7e7c&language=en-US"
          ),
        ])
        .then(([resMovie, resTv, resMovieGenresList, resTvGenresList]) => {
          let resAll = resMovie.data.results.concat(resTv.data.results); // array

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
            .slice(0, 2)
            .join(", ");
        });
    },

    checkTEMP() {
      console.log("selection", this.selectedGenre, this.selectedCategory);
    },

    // !! cut the results (strings) to a max length !!
  },

  mounted: function () {
    // ?? get movie's genres list and actors here ??
  },
});
