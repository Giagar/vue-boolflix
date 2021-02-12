new Vue({
    el: "#root",

    data: {
        searchByTerm: "",
        searchByTermResults: "",

        // more info displayed
        cast: "",
        movieGenresList: "",
        tvGenresList: "",
        // flag: "",
    },

    methods: {
        queryDatabase() {
            // retrieving data from the database
            axios
            .all([
                axios.get("https://api.themoviedb.org/3/search/movie?api_key=ce3b6870fdfccf78b80dcdd8f1af7e7c&query=" + this.searchByTerm),
                axios.get("https://api.themoviedb.org/3/search/tv?api_key=ce3b6870fdfccf78b80dcdd8f1af7e7c&query=" + this.searchByTerm),

                // get movie genres list
                axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=ce3b6870fdfccf78b80dcdd8f1af7e7c&language=en-US")
                // get series genres list
                // axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=ce3b6870fdfccf78b80dcdd8f1af7e7c&language=en-US")
            ])
            .then(([resMovie, resTv, resMovieGenresList]) => {
                
                let result = resMovie.data.results.concat(resTv.data.results); // array

                this.movieGenresList = resMovieGenresList.data.genres;

                // get genres
                

                console.log(this.movieGenresList);



                // result.map(movie => {
                //     axios
                //     .get("https://api.themoviedb.org/3/movie/75780/credits?api_key=ce3b6870fdfccf78b80dcdd8f1af7e7c")
                //     .then((resCast) => { // array

                //         console.log(resCast.data.cast.forEach());
                //         // let actors = cast.data.map(actor => actor.name)

                //         // return {...movie, actors: actor}
                //     })
                // })
                

                // checking for missing poster images and setting a default cover img
                result.forEach(obj => {
// ?? va bene passare true per nn fargli fare niente - (l'assegnazione funziona, ma il percorso è sbagliato) ?? 
                    obj.poster_path ? true : obj.poster_path = "./img-fallback/default-cover.jpg"
                });

                this.searchByTermResults = result;

                // empty the search field
                this.searchByTerm = "";

                // console.log(result)
            })

        },

        // render a gb flag when the value passed is
        displayGBFlag(movie) {
            return `./flags/${(movie.original_language === 'en' ? 'gb' : movie.original_language)}.svg`;
        },

        // display original title only if it is different from the title (both movies and series)
        displayOriginalTitle(movie) {
            return movie.original_title !== movie.title || movie.original_name !== movie.name;
        },

        // display filled or empty stars depending on the movie score
        displayStars(star, movie) {
            return `vote fa-star ${star <= Math.ceil(movie.vote_average / 2) ? 'fas' : 'far'}`;
        },

        // get more data: actors and genre (max: 2 items)
        displayMoreInfo(movie) {

            // get actors
            axios
            .get("https://api.themoviedb.org/3/movie/" + movie.id + "/credits?api_key=ce3b6870fdfccf78b80dcdd8f1af7e7c")
            .then(res => {
                res = res.data.cast;
                this.cast = res.map(actor => actor.name).slice(0, 2).join(", ")
            })
        },

        // displayGenres(movie) {
        //     let result =  movie.genre_ids.map(genre => {
        //         return this.movieGenresList.filter(obj => {
        //             return obj.id === genre
        //         })[0].name
        //     });
        //     console.log(result);
        //     return result;

        // },

        // cut the results (strings) to a max length

    },

    mounted: function() {
        // get movie's genres list
        
    },
    filters: {
    }

})