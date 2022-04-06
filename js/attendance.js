let dataArray = data.results[0].members

//Filtro de partidos
const filterParties = party => dataArray.filter(i => i.party == party).length

//----------------------------------Imprimir primer tabla de senado----------------------------------
/* function imprimirTablaSenado () {
    let getTableReps = document.querySelectorAll('.attendance-reps')
    getTableReps.forEach(i => i.innerHTML = 
    `${i.previousElementSibling.innerHTML == "Democrats" 
    ? filterParties("D")
    : i.previousElementSibling.innerHTML == "Republicans"
    ? filterParties("R")
    : i.previousElementSibling.innerHTML == "Independent"
    ? filterParties("ID")
    : i.previousElementSibling.innerHTML == "Total"
    ? dataArray.length
    : null}`)

    let getTableVotes = document.querySelectorAll('.attendance-votes')
    getTableVotes.forEach(i => i.innerHTML =
    `${i.previousElementSibling.previousElementSibling.innerHTML == "Democrats"
    ? "#" + getMembers("D")
    : i.previousElementSibling.previousElementSibling.innerHTML == "Republicans"
    ? "#" + getMembers("R")
    : i.previousElementSibling.previousElementSibling.innerHTML == "Independent"
    ? "#" + getMembers("ID")
    : i.previousElementSibling.previousElementSibling.innerHTML == "Total"
    ? "-"
    : null}`)
} */
//No funciona ^^^^^^^^^^^^^^

const getAttendance = document.querySelector("#tabla-total")

function imprimirTablaTotal() {
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
    <td>${dataArray.length}</td>
    <td>${getMembers("")}%</td>
    </tr>`
}


function getMembers(party) {
    let arr = []
    let getData = dataArray.filter(m => party == "" ? m.party : m.party == party ? m.party== party : null) 
    getData.forEach(a => arr.push(a.votes_with_party_pct))
    let getTotal = (arr.reduce((a, b) => a + b, 0)/arr.length).toFixed(2);
    return getTotal
}

imprimirTablaTotal()



//----------------------------------SEGUNDA Y TERCER TABLA----------------------------------

/* const sortByMostMissedVotes = dataArray.sort((a, b) => a.missed_votes - b.missed_votes)
const sortByLeastMissedVotes = dataArray.sort((a, b) => b.missed_votes - a.missed_votes) */

const body = document.querySelector("body")

if (body.id == "attendance") {
    const sortByMissedVotes = (check) => dataArray.sort((a, b) => check=="Most" ? a.missed_votes_pct - b.missed_votes_pct : check=="Least" ? b.missed_votes_pct - a.missed_votes_pct : null)

    let getTenPercentAllVotes = Math.floor(sortByMissedVotes("Least").length * 0.1)

    let arrLeast = []
    let arrMost = []
    for (let i = 0; i < getTenPercentAllVotes; i++) {
        arrLeast.push(sortByMissedVotes("Least")[i])
        arrMost.push(sortByMissedVotes("Most")[i])
    }

    let getTableLeastEngaged = document.querySelector("#least-engaged")
    let getTableMostEngaged = document.querySelector("#most-engaged")

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

    let filteredArray = dataArray.filter(m => m.total_votes != 0)
    const sortByMissedVotes = (check) => filteredArray.sort((a, b) => check=="Most" ? b.votes_with_party_pct - a.votes_with_party_pct : check=="Least" && a.votes_with_party_pct != 0.00 ? a.votes_with_party_pct - b.votes_with_party_pct : null)
    
    let getTenPercentAllVotes = Math.floor(sortByMissedVotes("Least").length * 0.1)

    

    let arrLeast = []
    let arrMost = []
    for (let i = 0; i < getTenPercentAllVotes; i++) {
        arrLeast.push(sortByMissedVotes("Least")[i])
        arrMost.push(sortByMissedVotes("Most")[i])
    }

    console.log(arrLeast, arrMost);

    let getTableLeastEngaged = document.querySelector("#least-loyal")
    let getTableMostEngaged = document.querySelector("#most-loyal")


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