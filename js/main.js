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

                this.searchByTermResults = result;

                // empty the search field
                this.searchByTerm = "";
            })

        },
    },

})