const body = document.querySelector("body")

if (body.id == "congress") {
    //-----------------------Creacion dinamica de tablas-------------------------
    function imprimirTablas (arr, id) {
        const getListaSenadores = document.querySelector(`#${id} #politician-table`)
        arr.forEach(info => {
            let tableRow = document.createElement("tr");
            tableRow.className = "table-row"
            tableRow.innerHTML = ` 
            <td><a href="${info.url}" class="link-text">${info.first_name + " " + (info.middle_name == null ? "" : info.middle_name ) + " " + info.last_name}</a></td>
            <td class="${info.party == "R" ? "table-danger" : info.party == "D" ? "table-primary" : "table-warning"}">${info.party}</td>
            <td>${info.state}</td>
            <td>${info.seniority}</td>
            <td>${info.votes_with_party_pct}%</td>`
            
            getListaSenadores.appendChild(tableRow)
        });
    }

    function dibujarTablas(array, id) {
        imprimirTablas(array, id)
    }

    //--------------------------------RECORRER ARRAY SEGUN CHECKBOX SELECCIONADO-------------------------------
    //AGARRAR EL FORM CON CHECKBOXES Y EL DROPDOWN
    const getForm = document.querySelector("form")
    const getSelect = document.querySelector("#select-dropdown")
    const getCheckbox = getForm.querySelectorAll("input[type='checkbox']")

    //IMPRIMIR SEGUN CAMBIO AL FORM
    function recorrerCheckbox(array, id) {
        const getListaSenadores = document.querySelector(`#${id} #politician-table`)
        let arrayCheckbox = Array.from(getCheckbox)
        let isChecked = arrayCheckbox.filter(c => c.checked)
        let checkBoxArray = isChecked.map(c => c.value)
        
        let auxiliar = []
        array.filter(miembro => checkBoxArray.forEach(checked => miembro.party == checked ? auxiliar.push(miembro) : null))
        
        let recorrerAuxiliar = auxiliar.filter(s => s.state == getSelect.value || getSelect.value == "all")
        dibujarTablasFiltradas(recorrerAuxiliar, id) //AL FINAL IMPRIMO EL ARRAY AUXILIAR

        if (checkBoxArray.length == 0) {
            getListaSenadores.innerHTML = ""
            let filterByState = array.filter(s => s.state == getSelect.value)
            dibujarTablasFiltradas(filterByState, id)
        }
        
        if (checkBoxArray.length === 0 && getSelect.value == "all") { 
            dibujarTablas(array, id)
        }
    }

    //DIBUJAR TABLA FILTRADA
    function dibujarTablasFiltradas(array, id) {
        const getListaSenadores = document.querySelector(`#${id} #politician-table`)
        getListaSenadores.innerHTML = ""
        imprimirTablas(array, id)
    }

    //CREAR EL DROPDOWN
    function getListOfStates(array) {
        let listOfStates = array.map(m => m["state"]).sort()
        let alphabeticStates = [...new Set(listOfStates)];
        return alphabeticStates
    }

    function createDropdown(array) {
        array.forEach(s => {
            let newOption = document.createElement("option")
            newOption.innerHTML = `${s}`
            newOption.value = `${s}`
            
            getSelect.appendChild(newOption)
        })
    }
}



if (body.id == "attendance" || body.id == "loyalty") {
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
}



//Obtener el json de forma asincrona

let chamber = document.querySelector("#table-senate") ? "senate" : "house"
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

        if (body.id == "congress") {
            const getForm = document.querySelector("form")
            dibujarTablas(members, `table-${chamber}`)
        
            getForm.addEventListener("change", () => {
            recorrerCheckbox(members, `table-${chamber}`)
            })

            createDropdown(getListOfStates(members))
        }

        if (body.id == "attendance" || body.id == "loyalty") {
            imprimirTablaTotal(members)
            filterByPage(members, chamber)
        }

        let loader = document.querySelector("#spinner-container")
        loader.classList.add("hidden")
    })