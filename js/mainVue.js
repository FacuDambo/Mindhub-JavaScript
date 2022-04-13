Vue.createApp({
    data() {
        return {
            message: 'Hello Vue!',
            urlapi: "",
            init: {
                method: "GET",
                headers: {
                    "X-API-Key": "7u7HxDcBz967AlQFNZJKamUHeeWU8mU0eaQbhINv"
                }
            }, 
            miembros: [],
            miembrosAuxiliar: [],
            party: [],
            states: "all",
            miembrosTotales: ""
        }
    },

    created() {
        this.urlapi = document.querySelector("#senate") ? `https://api.propublica.org/congress/v1/113/senate/members.json` : `https://api.propublica.org/congress/v1/113/house/members.json`

        fetch(this.urlapi, this.init)
            .then(res => res.json())
            .then(members => {
                this.miembros = members.results[0].members

                let loader = document.querySelector("#spinner-container")
                loader.classList.add("hidden")
            })
            .catch(err => console.warn(err))
    },

    methods: {
        filterParties(party){
            let filter = this.miembros.filter(i => i.party == party || (party == "" ? i.party : null)).length
            return filter
        },

        getMembers(party){
            let arr = []
            let getData = this.miembros.filter(m => party == "" ? m.party : m.party == party ? m.party == party : null)
            getData.forEach(a => arr.push(a.votes_with_party_pct))
            let getTotal = (arr.reduce((a, b) => a + b, 0)/arr.length).toFixed(2);
            return getTotal
        },

        getParties(){
            let filter = this.miembros.map(a => a.state).sort()
            let arrayFilter = [...new Set(filter)]
            return arrayFilter
        },

        getTenPercent(param){
            if (this.miembros.length !== 0) {
                let filteredArray = this.miembros.filter(m => m.total_votes != 0)

                if (param == "Most") {
                    let sortMost = filteredArray.sort((a, b) => a.missed_votes_pct - b.missed_votes_pct)
                    let getTenPercentMostVotes = Math.floor(sortMost.length * 0.1)

                    let arrMost = []

                    while (sortMost[getTenPercentMostVotes - 1].missed_votes_pct == sortMost[getTenPercentMostVotes].missed_votes_pct) {
                        getTenPercentMostVotes++
                    }

                    for (let i = 0; i < getTenPercentMostVotes; i++) {
                    arrMost.push(sortMost[i])
                    }
                    
                    return arrMost
                }

                if (param == "Least") {
                    let sortLeast = filteredArray.sort((a, b) => b.missed_votes_pct - a.missed_votes_pct)
                    let getTenPercentLeastVotes = Math.floor(sortLeast.length * 0.1)

                    let arrLeast = []

                    while (sortLeast[getTenPercentLeastVotes - 1].missed_votes_pct == sortLeast[getTenPercentLeastVotes].missed_votes_pct) {
                        getTenPercentLeastVotes++
                    }

                    for (let i = 0; i < getTenPercentLeastVotes; i++) {
                    arrLeast.push(sortLeast[i])
                    }

                    return arrLeast
                }
            }
        },

        getTenPercentLoyalty(param){
            if (this.miembros.length !== 0) {
                let filteredArray = this.miembros.filter(m => m.total_votes != 0)

                if (param == "Least") {
                    let sortMost = filteredArray.sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct)
                    let getTenPercentMostVotes = Math.floor(sortMost.length * 0.1)

                    let arrMost = []

                    while (sortMost[getTenPercentMostVotes - 1].votes_with_party_pct == sortMost[getTenPercentMostVotes].votes_with_party_pct) {
                        getTenPercentMostVotes++
                    }

                    for (let i = 0; i < getTenPercentMostVotes; i++) {
                    arrMost.push(sortMost[i])
                    }
                    
                    return arrMost
                }

                if (param == "Most") {
                    let sortLeast = filteredArray.sort((a, b) => b.votes_with_party_pct - a.votes_with_party_pct)
                    let getTenPercentLeastVotes = Math.floor(sortLeast.length * 0.1)

                    let arrLeast = []

                    while (sortLeast[getTenPercentLeastVotes - 1].votes_with_party_pct == sortLeast[getTenPercentLeastVotes].votes_with_party_pct) {
                        getTenPercentLeastVotes++
                    }

                    for (let i = 0; i < getTenPercentLeastVotes; i++) {
                    arrLeast.push(sortLeast[i])
                    }

                    return arrLeast
                }
            }
        }
    },

    computed: {
        recorrerCheckbox(){
            this.miembrosAuxiliar = []
            this.miembros.forEach(miemb => {
                this.party.forEach(checked => miemb.party == checked ? this.miembrosAuxiliar.push(miemb) : null)
            });

            let recorrerAux = this.miembrosAuxiliar.filter(s => s.state == this.states || this.states == "all")
            this.miembrosAuxiliar = recorrerAux

            if (this.party.length == 0) {
                let filterByState = this.miembros.filter(s => s.state == this.states)
                this.miembrosAuxiliar = filterByState
            }

            if (this.party.length == 0 && this.states == "all" || this.states == "") {
                this.miembrosAuxiliar = this.miembros
            }
        },
    }
}).mount('#app')