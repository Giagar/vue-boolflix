new Vue({
    el: "#root",

    data: {
        searchByTerm: "",
        searchByTermResults: "",
    },

    methods: {
        queryDatabase() {
            // retrieving data from the database
            axios
            .get("https://api.themoviedb.org/3/search/movie?api_key=ce3b6870fdfccf78b80dcdd8f1af7e7c&query=" + this.searchByTerm)
            .then(res => {
                let result = res.data.results // array

                this.searchByTermResults = result;

                // empty the search field
                this.searchByTerm = "";
            })

        },

        // converting a language into a flag code
        countryFlags(value) {
            console.log("value", value);
            let result = "";

            switch(value) {
                case "en":
                    result = "us";
                    break;
                default:
                    result = false;
            }
            console.log("result", result);
            return result;
        }
    },

})