new Vue({
    el: "#root",

    data: {
        searchByTerm: "",
        queryResults: [],
        page: 1,
    }, 

    methods: {
        handleQuery() {
            axios
            .get("https://api.themoviedb.org/3/search/movie?api_key=ce3b6870fdfccf78b80dcdd8f1af7e7c&query=" + this.searchByTerm + "&page=" + this.page)
            .then(res => {
                this.queryResults = [...this.queryResults, ...res.data.results];
                

                if(res.data.total_pages !== 1) {
                    // let i;
                    // console.log((res.data.total_pages));
                    if(this.page <= res.data.total_pages) {
                        this.page = this.page + 1;
                        // i+=1;
                        this.handleQuery()
                    }
                }

                // this.searchByTerm = "";
            })
            // .then(() => {
            //     this.searchByTerm = "";
            //     this.queryResults = [];
            //     this.page = 1;
            // })

        }
    }
})