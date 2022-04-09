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
const getSelectValue = getSelect.value
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

        dibujarTablas(members, `table-${chamber}`)

        

        getForm.addEventListener("change", () => {
            recorrerCheckbox(members, `table-${chamber}`)
        })
        
        createDropdown(getListOfStates(members))

        let loader = document.querySelector("#spinner-container")
        loader.classList.add("hidden")
    })