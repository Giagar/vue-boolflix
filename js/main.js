new Vue({
    el: "#root",

    data: {
        searchByTerm: "",
        searchByTermResults: "",
        // flag: "",
    },

    methods: {
        queryDatabase() {
            // retrieving data from the database
            axios
            .all([
                axios.get("https://api.themoviedb.org/3/search/movie?api_key=ce3b6870fdfccf78b80dcdd8f1af7e7c&query=" + this.searchByTerm),
                axios.get("https://api.themoviedb.org/3/search/tv?api_key=ce3b6870fdfccf78b80dcdd8f1af7e7c&query=" + this.searchByTerm)
            ])
            .then(([res1, res2]) => {
                
                let result = res1.data.results.concat(res2.data.results); // array

                // checking for missing poster images and setting a default cover img
                result.forEach(obj => {
// ?? va bene passare true per nn fargli fare niente - (l'assegnazione funziona, ma il percorso è sbagliato) ?? 
                    obj.poster_path ? true : obj.poster_path = "./img-fallback/default-cover.jpg"
                });

                this.searchByTermResults = result;

                // empty the search field
                this.searchByTerm = "";
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
    },
    filters: {
    }

})