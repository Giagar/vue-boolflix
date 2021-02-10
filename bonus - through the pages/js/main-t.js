new Vue({
    el: "#root",

    data: {
        // input from the user
        searchByTerm: "",

        // data fetched from the database
        queryResults: [],

        // total data pages (20 results each page)
        totalPages: 0,

        // page of the results
        page: 1,

        queryTerm: "",
    }, 

    methods: {
        // retrieve data
        handleQuery() {
            axios
            .get("https://api.themoviedb.org/3/search/movie?api_key=ce3b6870fdfccf78b80dcdd8f1af7e7c&query=" + this.queryTerm + "&page=" + this.page)
            .then(res => {
                this.totalPages = res.data.total_pages;
                this.queryResults = [...res.data.results]
            })            
        },

        // retrieve data for the next page of results
        nextPage() {
            this.page += 1;
            this.handleQuery()
        },

        // retrieve data for the previous page of results
        prevPage() {
            this.page -= 1;
            this.handleQuery()
        },

        resetQuery() {
            this.searchByTerm = "";
            this.page = 1;

            // useful only when someone does not fill the input field, but press "invia"
            // this.queryResults = [];
            // this.totalPages = 0;
        },

        // it creates a copy of the user input in order to be able to continue to move throuch the researched pages even when the input field is changed
        copyQuery() {
            this.queryTerm = this.searchByTerm;
        }
    }
})