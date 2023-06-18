//********************Rando player table creation functions********************

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

//Functions to remove old rand_player data
function deletePreviousData(dataPresent) {
    if (dataPresent) {
        tableData = document.querySelectorAll(".tableData");
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


function createTableRowHeaders(careerTotals, yearlyTotals) {
    const careerTableColNames = document.querySelector("#careerPlayerRowNames");
    const yearlyTableColNames = document.querySelector("#yearlyPlayerRowNames");
    const headersNeeded = document.querySelectorAll(".tableHeader").length == 0;
    if (headersNeeded) {
        createTableHeader(careerTotals, careerTableColNames);
        createTableHeader(yearlyTotals[0], yearlyTableColNames);
    }
}


function getStatsCreateLink(data) {
    const anchorTag = document.querySelector("#randomPlayerLink");
    fullName = data[0]["first_name"] + " " + data[0]["last_name"]
    anchorTag.href = data[0]['bb_ref_link']
    anchorTag.innerText = fullName

    careerTotals = data[1]
    yearlyTotals = data[2]["all_years"]
    return [careerTotals, yearlyTotals]
}


function createYearlyTotalsRows(yearlyTotals) {
    const yearlyTable = document.querySelector("#playerYearly")
    for (let i = 0; i < yearlyTotals.length; i++) {
        if (i != 0) {
            const newRow = document.createElement("tr");
            newRow.classList.add("yearlyPlayerDataRow")
            yearlyTable.insertAdjacentElement("beforeend", newRow)
        }
        yearlyTableData = document.querySelectorAll(".yearlyPlayerDataRow")
        createTableData(yearlyTotals[i], yearlyTableData[yearlyTableData.length - 1]);
    }
}


//Random player button functionality
//Add async functionality?
function revealRandomPlayer() {
    deleteOldRows()
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
            createTableRowHeaders(careerTotals, yearlyTotals)
            createTableData(careerTotals, careerTableData);
            createYearlyTotalsRows(yearlyTotals)
        }
    })
}

const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
randomPlayerBtn.addEventListener("click", revealRandomPlayer)



