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
    }, 

    methods: {
        handleQuery() {
            axios
            .get("https://api.themoviedb.org/3/search/movie?api_key=ce3b6870fdfccf78b80dcdd8f1af7e7c&query=" + this.searchByTerm + "&page=" + this.page)
            .then(res => {
                this.totalPages = res.data.total_pages;
                this.queryResults = [...res.data.results]
                console.log(this.totalPages)

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
    }
})