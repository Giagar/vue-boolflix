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

                // check for missing poster images and substitution with a default cover img
                result.forEach(obj => {
// ?? va bene passare true per nn fargli fare niente - (l'assegnazione funziona, ma il percorso è sbagliato) ?? 
                    obj.poster_path ? true : obj.poster_path = "./img-fallback/default-cover.jpg"
                });

                console.log(result);

                this.searchByTermResults = result;

                // empty the search field
                this.searchByTerm = "";
            })

        },
    },

})