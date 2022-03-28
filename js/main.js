// Ej B

let senateMembers = data.results[0].members.map(m => m.first_name + " " + (m.middle_name == null ? "" : m.middle_name ) + " " + m.last_name)
console.table(senateMembers);

// Ej C

let listOfStates = data.results[0].members.map(m => m["state"]).sort()
let alphabeticStates = [...new Set(listOfStates)];
console.table(alphabeticStates);

// Ej D

const filterByParty = (party) => {
    let filteredParties = data.results[0].members.filter(i => i.party == party)
    let finalResults = filteredParties.map(i => i.first_name + " " + (i.middle_name == null ? "" : i.middle_name ) + " " + i.last_name)
    console.table(finalResults);
}
//Posibles valores = "R", "D" y -solo para senate- "ID"
filterByParty("D")

// Ej E

const filterByState = (state) => {
    let filteredStates = data.results[0].members.filter(i => i.state == state)
    let finalResults = filteredStates.map(i => i.first_name + " " + (i.middle_name == null ? "" : i.middle_name ) + " " + i.last_name)
    console.table(finalResults);
}
//Ver los 50 valores utilizables en la consola / House tiene 56 posibles valores (????)
filterByState("CA")



//Creacion dinamica de tablas

function dibujarTablas(array) {
    // 1 - Capturar elemento donde van los datos
    const listaSenadores = document.querySelector('#politician-data')
    // 2 - Recorrer el array de datos
    array.results[0].members.forEach(info => {
        // 3 - Crear el elemento donde van a ir los datos
        let tableRow = document.createElement("tr");
        // 4 - Inyectarle la info
        tableRow.innerHTML = ` 
        <td><a href="${info.url}">${info.first_name + " " + (info.middle_name == null ? "" : info.middle_name ) + " " + info.last_name}</a></td>
        <td>${info.party}</td>
        <td>${info.state}</td>
        <td>${info.seniority}</td>
        <td>${info.votes_with_party_pct}%</td>`

        // 5 - Anexar el elemento nuevo al padre
        listaSenadores.appendChild(tableRow)
    });
}

dibujarTablas(data)