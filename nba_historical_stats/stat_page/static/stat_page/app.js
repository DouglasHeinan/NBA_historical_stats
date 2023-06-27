//********************Rando player table creation functions********************

//***********Random Color Change Stuff for the sake of changing color**********

/**
createTableHeader takes two arguments and returns nothing.

It takes in a dictionary of player information and uses the keys to create, name, and insert
each <th> element for the player table.

@param data - A dictionary of player data
@param - row - The specific table row in the html file this row of header is added to
*/
function createTableHeader(data, row) {
    const rowNames = Object.keys(data)
    for (let i = 1; i < rowNames.length; i++) {
        const colName = document.createElement("th");
        colName.classList.add("tableHeader")
        colName.innerText = rowNames[i];
        row.insertAdjacentElement("beforeend", colName)
    }
}

/**
createTableData takes two arguments and returns nothing.

This function takes in a dictionary of player data and uses the values to create, populate, and insert
each <td> element for the player table.

@param data - A dictionary of player data
@param table - The specific table the player data is to be added to.
*/
function createTableData(data, table) {
    values = Object.values(data)
    for (let i = 1; i < values.length; i++) {
        const colData = document.createElement("td");
        colData.classList.add("tableData")
        colData.style.textAlign = "center";
        if (!values[i]) {
            values[i] = '-'
        }
        colData.innerText = values[i];
        table.insertAdjacentElement("beforeend", colData)
    }
}


/**
createTableRowHeaders takes two arguments and returns nothing.

This function takes in two dictionaries and checks to see if <th> elements have been created
for the data in those dictionaries. If this is the first time the randomPlayer function
has been called, those <th> elements will not have been created. On all subsequent
calls of that function, those elements will already exist and be populated and this function
do nothing.

@param careerTotals - A dictionary of table columns headers
@param yearlyTotals - A dictionary of table columns headers
*/
function createTableRowHeaders(careerTotals, yearlyTotals) {
    const headersNeeded = document.querySelectorAll(".tableHeader").length == 0;
    if (headersNeeded) {
        const careerTableColNames = document.querySelector("#careerPlayerRowNames");
        const yearlyTableColNames = document.querySelector("#yearlyPlayerRowNames");
        createTableHeader(careerTotals, careerTableColNames);
        createTableHeader(yearlyTotals, yearlyTableColNames);
    }
}


function createYearlyTotalsRows(yearlyTotals) {
    const yearlyTable = document.querySelector("#playerYearly")
    for (let i = 0; i < yearlyTotals.length; i++) {
        if (i != 0) {
            const newRow = document.createElement("tr");
            newRow.classList.add("yearlyPlayerDataRow")
            yearlyTable.insertAdjacentElement("beforeend", newRow)
        }
        const yearlyTableData = document.querySelectorAll(".yearlyPlayerDataRow")
        createTableData(yearlyTotals[i], yearlyTableData[yearlyTableData.length - 1]);
    }
}

//********************Functions to remove old rand_player data********************
function deletePreviousData(dataPresent) {
    if (dataPresent) {
        const tableData = document.querySelectorAll(".tableData");
        for (let i = 0; i < tableData.length; i++) {
            tableData[i].remove()
        }
    }
}


function deleteOldRows() {
    const toDelete = document.querySelectorAll(".yearlyPlayerDataRow");
    for (i = 1; i < toDelete.length; i++) {
        toDelete[i].remove();
    }
}


function checkForPreviousData() {
    const dataPresent = document.querySelectorAll(".tableData") != [];
    if (dataPresent) {
        deletePreviousData(dataPresent)
    }
}

//********************Basic player data functions********************
function getStatsCreateLink(data) {
    const anchorTag = document.querySelector("#randomPlayerLink");
    const fullName = data[0]["first_name"] + " " + data[0]["last_name"]
    anchorTag.href = data[0]['bb_ref_link']
    anchorTag.innerText = fullName
    const careerTotals = data[1]
    const yearlyTotals = data[2]["all_years"]
    return [careerTotals, yearlyTotals]
}


function revealButton() {
    const showButton = document.querySelector("#makeChart");
    showButton.classList.remove("hidden")
}


//********************Main function********************
function randomPlayer() {
    deleteOldRows()
    revealButton()
    fetch('rando_json/', {
        headers:{
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
        }
    })
    .then(response => {
        return response.json() //Convert response to JSON
    })
    .then(data => {
        const [careerTotals, yearlyTotals] = getStatsCreateLink(data)
        checkForPreviousData()
        if (careerTotals) {
            const careerTableData = document.querySelector("#careerPlayerDataRow")
            createTableRowHeaders(careerTotals, yearlyTotals[0])
            createTableData(careerTotals, careerTableData);
            createYearlyTotalsRows(yearlyTotals)
            revealButton()
        }
//        return data[0]["id"]
    })
}

const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
curPlayerID = randomPlayerBtn.addEventListener("click", randomPlayer)
//randomPlayerBtn.addEventListener("click", function () {
//    curPlayerID = randomPlayer();
//    console.log(curPlayerID)
//    console.log(randomPlayer())
//})



//*********************CHART MAKING FUNCTIONS*************************
//function chartStat(evt, curPlayerID) {
//    fetch('chart_stat/', {
//        headers:{
//            'Content-Type': 'application/json',
//            'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
//        }
//    })
//    .then(response => {
//        return response.json()
//    })
//    .then(data => {
//        console.log(data.greeting)
//        console.log(curPlayerID)
//    })
//}


//const chartPlayerThrees = document.querySelector("#makeChart");
//chartPlayerThrees.addEventListener("click", (evt) => {
//    chartStat(evt, curPlayerID)
//});