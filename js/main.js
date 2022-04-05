// Ej B

let senateMembers = data.results[0].members.map(m => m.first_name + " " + (m.middle_name == null ? "" : m.middle_name ) + " " + m.last_name)
/* console.table(senateMembers); */

// Ej C

let listOfStates = data.results[0].members.map(m => m["state"]).sort()
let alphabeticStates = [...new Set(listOfStates)];
/* console.table(alphabeticStates); */

// Ej D

const filterByParty = (party) => {
    let filteredParties = data.results[0].members.filter(i => i.party == party)
    let finalResults = filteredParties.map(i => i.first_name + " " + (i.middle_name == null ? "" : i.middle_name ) + " " + i.last_name)
    /* console.table(finalResults); */
}
//Posibles valores = "R", "D" y -solo para senate- "ID"
filterByParty("D")

// Ej E

const filtrarByState = (state) => {
    let filteredStates = data.results[0].members.filter(i => i.state == state)
    let finalResults = filteredStates.map(i => i.first_name + " " + (i.middle_name == null ? "" : i.middle_name ) + " " + i.last_name)
    /* console.table(finalResults); */
}
//Ver los 50 valores utilizables en la consola / House tiene 56 posibles valores (????)
filtrarByState("CA")











//-----------------------Creacion dinamica de tablas-------------------------
const getListaSenadores = document.querySelector('#politician-table')
const dataArray = data.results[0].members


function imprimirTablas (array) {
    array.forEach(info => {
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

function dibujarTablas() {
    imprimirTablas(dataArray)
}

dibujarTablas()




//--------------------------------RECORRER ARRAY SEGUN CHECKBOX SELECCIONADO-------------------------------
//AGARRAR EL FORM CON CHECKBOXES Y EL DROPDOWN
const getForm = document.querySelector("form")
const getSelect = document.querySelector("#select-dropdown")
const getSelectValue = getSelect.value
const getCheckbox = getForm.querySelectorAll("input[type='checkbox']")

//AGREGO LOS CHECKBOXES QUE ESTÉN CHEQUEADOS Y LOS PASO A UN ARRAY, DEPENDIENDO DE LA SELECCION VA A MOSTRAR LOS QUE ESTEN SELECCIONADOS
function recorrerCheckbox() {
    let arrayCheckbox = Array.from(getCheckbox)
    let isChecked = arrayCheckbox.filter(c => c.checked)
    let checkBoxArray = isChecked.map(c => c.value)

    //RECORRO EL ARRAY DE MIEMBROS Y EN EL MISMO RECORRIDO RECORRO A LOS CHECKBOXES CHEQUEADOS, 
    //DENTRO DE ESE RECORRIDO PREGUNTO SI LA PARTY DEL MEMBER ES IGUAL AL VALOR CHEQUEADO
    //SI SE CUMPLE ESA CONDICION EMPUJAME TODOS ESOS DATOS A UN ARRAY AUXILIAR, SI NO SE CUMPLE NO HAGAS NADA
    let auxiliar = []
    dataArray.filter(miembro => checkBoxArray.forEach(checked => miembro.party == checked ? auxiliar.push(miembro) : null))
    
    //RECORRO EL ARRAY AUXILIAR PARA QUE ME IMPRIMA SEGUN EL ESTADO
    //EVALÚO SI EL VALOR DE ESTADO EN EL ARRAY AUXILIAR ES IGUAL AL VALOR DEL SELECT
    //O SI ES IGUAL A ALL, SI SE CUMPLE ALGUNA IMPRIMIME ESE ARRAY FILTRADO
    let recorrerAuxiliar = auxiliar.filter(s => s.state == getSelect.value || getSelect.value == "all")
    dibujarTablasFiltradas(recorrerAuxiliar) //AL FINAL IMPRIMO EL ARRAY AUXILIAR

    //ACA IMPRIMO LA TABLA COMPLETA SOLO CUANDO EL LARGO DEL ARRAY DE CHECKBOXES ES IGUAL A 0
    if (checkBoxArray.length == 0) {
        getListaSenadores.innerHTML = ""
        let filterByState = dataArray.filter(s => s.state == getSelect.value)
        dibujarTablasFiltradas(filterByState)
    }

    //SI EL LARGO DEL ARRAY DE CHECKBOXES ES IGUAL A 0 NO SE IMPRIMÍA NADA
    //ACA HAGO UN CONDICIONAL EN EL CUAL SI EL LARGO ES IGUAL A 0 Y SI EL VALOR DEL DROPDOWN ES IGUAL A TODOS
    //ME IMPRIME TODA LA TABLA COMPLETA
    if (checkBoxArray.length === 0 && getSelect.value == "all") { 
        dibujarTablas()
    }
}

//AGREGAR EVENTO CUANDO CAMBIE
getForm.addEventListener("change", () => {
    recorrerCheckbox()
})

//DIBUJAR TABLA FILTRADA
function dibujarTablasFiltradas(array) {
    getListaSenadores.innerHTML = ""
    imprimirTablas(array)
}


//--------------------------------RECORRER POR ESTADOS-------------------------------
//CREAR EL DROPDOWN

function createDropdown(array) {
    array.forEach(s => {
        let newOption = document.createElement("option")
        newOption.innerHTML = `${s}`
        newOption.value = `${s}`

        getSelect.appendChild(newOption)
    })

}
createDropdown(alphabeticStates) //LO SAQUE DEL EJERCICIO C