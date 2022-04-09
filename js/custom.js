//Filtro de partidos
const getAttendance = document.querySelector("#tabla-total")

function imprimirTablaTotal(array) {
    const filterParties = (party) => array.filter(i => i.party == party).length
    
    function getMembers(party) {
        let arr = []
        let getData = array.filter(m => party == "" ? m.party : m.party == party ? m.party== party : null) 
        getData.forEach(a => arr.push(a.votes_with_party_pct))
        let getTotal = (arr.reduce((a, b) => a + b, 0)/arr.length).toFixed(2);
        return getTotal
    }

    getAttendance.innerHTML = 
    `<tr>
    <td>Democrats</td>
    <td>${filterParties("D")}</td>
    <td>${getMembers("D")}%</td>
    </tr>

    <tr>
    <td>Republicans</td>
    <td>${filterParties("R")}</td>
    <td>${getMembers("R")}%</td>
    </tr>

    <tr>
    <td>Independent</td>
    <td>${filterParties("ID")}</td>
    <td>${(getMembers("ID") > 0 ? getMembers("ID") : 0)}%</td>
    </tr>

    <tr>
    <td>Total</td>
    <td>${array.length}</td>
    <td>${getMembers("")}%</td>
    </tr>`
}


//----------------------------------SEGUNDA Y TERCER TABLA----------------------------------


function filterByPage(array, id) {
    const body = document.querySelector("body")
    if (body.id == "attendance") {
        let filteredArray = array.filter(m => m.total_votes != 0)
        const sortByMissedVotes = (check) => filteredArray.sort((a, b) => 
        check=="Most" ? a.missed_votes_pct - b.missed_votes_pct : 
        check=="Least" ? b.missed_votes_pct - a.missed_votes_pct : null)

        let getTenPercentLeastVotes = Math.floor(sortByMissedVotes("Least").length * 0.1)
        let getTenPercentMostVotes = Math.floor(sortByMissedVotes("Most").length * 0.1)

        let arrLeast = []
        let arrMost = []


        function megaSuperAwesomeFunction(funct, votes, array) {
            //CHEQUEAR SI SE REPITEN LOS NUMEROS, EN CASO DE REPETIRSE AGREGAR MAS LENGTH
            while (funct[votes - 1].missed_votes_pct == funct[votes].missed_votes_pct) {
                votes++
            }


            //EMPUJAR A UN ARRAY NUEVO (DEPENDIENDO SI ES MOST O LEAST)
            for (let i = 0; i < votes; i++) {
                array.push(funct[i])
            }
        }
        megaSuperAwesomeFunction(sortByMissedVotes("Most"), getTenPercentMostVotes, arrMost)
        megaSuperAwesomeFunction(sortByMissedVotes("Least"), getTenPercentLeastVotes, arrLeast)


        //IMPRIMIR TABLA
        let getTableLeastEngaged = document.querySelector(`#${id}-least-engaged`)
        let getTableMostEngaged = document.querySelector(`#${id}-most-engaged`)
        
        function printMembersEngagment(array, id) {
            array.forEach(info => {
            let createRow = document.createElement("tr");
            createRow.className = "table-row"
            createRow.innerHTML = 
            `<td><a href="${info.url}" class="link-text">${info.first_name + " " + (info.middle_name == null ? "" : info.middle_name ) + " " + info.last_name}</a></td>
            <td>${info.missed_votes}</td>
            <td>${info.missed_votes_pct}%</td>`
            
            id.appendChild(createRow)
            })
        }

        printMembersEngagment(arrLeast, getTableLeastEngaged)
        printMembersEngagment(arrMost, getTableMostEngaged)
    }


    if (body.id == "loyalty") {
        let filteredArray = array.filter(m => m.total_votes != 0)
        const sortByMissedVotes = (check) => filteredArray.sort((a, b) => 
        check=="Most" ? b.votes_with_party_pct - a.votes_with_party_pct : 
        check=="Least" ? a.votes_with_party_pct - b.votes_with_party_pct : null)

        let getTenPercentLeastVotes = Math.floor(sortByMissedVotes("Least").length * 0.1)
        let getTenPercentMostVotes = Math.floor(sortByMissedVotes("Most").length * 0.1)


        let arrLeast = []
        let arrMost = []

        function megaSuperAwesomeFunction(fun, votes, array) {
            //CHEQUEAR SI SE REPITEN LOS NUMEROS, EN CASO DE REPETIRSE AGREGAR MAS LENGTH
            while (fun[votes - 1].votes_with_party_pct == fun[votes].votes_with_party_pct) {
                votes++
            }

            //EMPUJAR A UN ARRAY NUEVO (DEPENDIENDO SI ES MOST O LEAST)
            for (let i = 0; i < votes; i++) {
                array.push(fun[i])
            }
        }
        megaSuperAwesomeFunction(sortByMissedVotes("Least"), getTenPercentLeastVotes, arrLeast)
        megaSuperAwesomeFunction(sortByMissedVotes("Most"), getTenPercentMostVotes, arrMost)


        let getTableLeastEngaged = document.querySelector(`#${id}-least-loyal`)
        let getTableMostEngaged = document.querySelector(`#${id}-most-loyal`)

        function printMembersLoyalty(array, id) {
            array.forEach(info => {
            let createRow = document.createElement("tr");
            createRow.className = "table-row"
            createRow.innerHTML = 
            `<td><a href="${info.url}" class="link-text">${info.first_name + " " + (info.middle_name == null ? "" : info.middle_name ) + " " + info.last_name}</a></td>
            <td>${Math.round(info.total_votes / 100 * info.votes_with_party_pct)}</td>
            <td>${info.votes_with_party_pct}%</td>`
            
            id.appendChild(createRow)
            })
        }

        printMembersLoyalty(arrLeast, getTableLeastEngaged)
        printMembersLoyalty(arrMost, getTableMostEngaged)
    }
}

//Obtener el json de forma asincrona

let chamber = document.querySelector("#house") ? "house" : "senate"
const URLAPI = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`

let init = {
    method: "GET",
    headers: {
        "X-API-Key": "7u7HxDcBz967AlQFNZJKamUHeeWU8mU0eaQbhINv"
    }
}

fetch(URLAPI, init)
.then(res => res.json())
.then(mem => {
    const members = mem.results[0].members
    
    imprimirTablaTotal(members)
    filterByPage(members, chamber)
    
        let loader = document.querySelector("#spinner-container")
        loader.classList.add("hidden")
    })