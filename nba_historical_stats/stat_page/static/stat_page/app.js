//********************Main functions********************


//***************Random Player**************************
const randomPlayer = async() => {
    curPlayerID = null;
    deleteOldRows();
    const playerRes = await fetchData();
    const playerData = await playerRes.json();
    const [careerTotals, yearlyTotals] = getStatsCreateLink(playerData);
    checkForPreviousData();
    console.log(playerData)
    if (careerTotals) {
        createAndPopulateTable(careerTotals, yearlyTotals);
        toggleChartButton("show");
    } else {
        toggleChartButton("hidden");
    }
    return playerData;
}


const fetchData = async() => {
    const playerRes = await fetch('rando_json/', {
        headers:{
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
        }
    });
    return playerRes;
}


let curPlayer = null;
const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
randomPlayerBtn.addEventListener("click", async() => {
    curPlayer = await randomPlayer();
    makeChart(curPlayer);
})


//********************Chart Player*******************************
function makeChart(player) {
    yearsPlayed = player[2]["all_years"].length;
	graphDiv = document.getElementById('plot');
	toGraphX = "year";
	toGraphY = "min";
	xAxis = makeAxis(yearsPlayed, player, toGraphX);
	yAxis = makeAxis(yearsPlayed, player, toGraphY);
	Plotly.newPlot( graphDiv, [{
	x: xAxis,
	y: yAxis }], {
	margin: { t: 0 } } );
}
//Need to return list of player objects that only inlude the necessary years,
//not a list of years.


function makeAxis(yearsPlayed, player, toGraph) {
    let axes = [];
    for (let i = 0; i < yearsPlayed; i++) {
        let axis = player[2]["all_years"][i][toGraph];
        if (!axis) {
            axis = 0;
        }
        axes.push(axis);
    }
    return axes;
}

//********************Rando player table creation functions********************

/**
createTableHeader takes two arguments and returns nothing.

It takes in a dictionary of player information and uses the keys to create, name, and insert
each <th> element for the player table.

@param data - A dictionary of player data
@param - row - The specific table row in the html file this row of header is added to
*/
function createTableHeader(data, row) {
    const rowNames = Object.keys(data);
    for (let i = 1; i < rowNames.length; i++) {
        const colName = document.createElement("th");
        colName.classList.add("tableHeader");
        colName.innerText = rowNames[i];
        row.insertAdjacentElement("beforeend", colName);
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
    values = Object.values(data);
    for (let i = 1; i < values.length; i++) {
        const colData = document.createElement("td");
        colData.classList.add("tableData");
        colData.style.textAlign = "center";
        if (!values[i]) {
            values[i] = '-';
        }
        colData.innerText = values[i];
        table.insertAdjacentElement("beforeend", colData);
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
    const yearlyTable = document.querySelector("#playerYearly");
    for (let i = 0; i < yearlyTotals.length; i++) {
        if (i != 0) {
            const newRow = document.createElement("tr");
            newRow.classList.add("yearlyPlayerDataRow");
            yearlyTable.insertAdjacentElement("beforeend", newRow);
        }
        const yearlyTableData = document.querySelectorAll(".yearlyPlayerDataRow");
        createTableData(yearlyTotals[i], yearlyTableData[yearlyTableData.length - 1]);
    }
}

//********************Functions to remove old rand_player data********************
function deletePreviousData(dataPresent) {
    if (dataPresent) {
        const tableData = document.querySelectorAll(".tableData");
        for (let i = 0; i < tableData.length; i++) {
            tableData[i].remove();
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
        deletePreviousData(dataPresent);
    }
}

//********************Basic player data functions********************
function getStatsCreateLink(data) {
    const anchorTag = document.querySelector("#randomPlayerLink");
    const fullName = data[0]["first_name"] + " " + data[0]["last_name"];
    anchorTag.href = data[0]['bb_ref_link'];
    anchorTag.innerText = fullName;
    let careerTotals = null;
    let yearlyTotals = null;
    if (data[2]) {
        careerTotals = data[1];
        yearlyTotals = data[2]["all_years"];
    }
    return [careerTotals, yearlyTotals];
}


function toggleChartButton(toggle) {
    const showButton = document.querySelector("#makeChart");
    if (toggle == "show") {
        showButton.classList.remove("hidden");
    } else {
        showButton.classList.add("hidden");
    }
}


function createAndPopulateTable(careerTotals, yearlyTotals) {
        const careerTableData = document.querySelector("#careerPlayerDataRow");
        createTableRowHeaders(careerTotals, yearlyTotals[0]);
        createTableData(careerTotals, careerTableData);
        createYearlyTotalsRows(yearlyTotals);
}





