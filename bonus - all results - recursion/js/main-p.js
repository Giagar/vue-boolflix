new Vue({
    el: "#root",

    data: {
        // input from the user
        searchByTerm: "",

        // data fetched from the database
        queryResults: [],

        // page of the results
        page: 1,
    }, 

    methods: {
        handleQuery() {
            axios
            .get("https://api.themoviedb.org/3/search/movie?api_key=ce3b6870fdfccf78b80dcdd8f1af7e7c&query=" + this.searchByTerm + "&page=" + this.page)
            .then(res => {
                this.queryResults = [...this.queryResults, ...res.data.results];
                

                if(res.data.total_pages !== 1) {
                    
                    if(this.page <= res.data.total_pages) {
                        this.page = this.page + 1;

                        this.handleQuery()
                    } else {
                        // reset starting variables
                        this.searchByTerm = "";
                        this.page = 1;
                    }
                }

            })            
        },
        
        // to empty the results page
        resetQueryResults() {
            this.queryResults = [];
        }
    }
})