
//********************Query Selectors********************

const randPlayerLink = document.querySelector("#randomPlayerLink");
const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
const graphingBtn = document.querySelector("#makeChart");
const careerTableData = document.querySelector("#careerPlayerDataRow");
const yearlyTable = document.querySelector("#playerYearly");
const graphTypeBtn = document.querySelector("#selectChartType");
const dropdownDiv = document.querySelector(".dropdownOptions");
const dropBtns = document.querySelectorAll(".statDrop");
const chart = document.querySelector("#plot");


//********************Global Variables******************

let curPlayer = null;
const statBtnLength = dropBtns.length;


//***********************Event Listeners***************

randomPlayerBtn.addEventListener("click", async() => {
    curPlayer = await randomPlayer();
    plot.classList.add("hidden");
})


graphingBtn.addEventListener("click", function() {
    toggleHidden(dropdownDiv);
})


for (let i = 0; i < statBtnLength; i++) {
    dropBtns[i].addEventListener("click", function() {
        statToGrab = dropBtns[i].innerText;
        toggleHidden(dropdownDiv);
        chart.classList.remove("hidden");
        makeChart(curPlayer, statToGrab);
    })
}


//*********************Utility Functions***************
//These functions are called by other functions throughout this file.

/**
* This function toggles the 'hidden' class of the passed element.
* @param {Object} element - An html element whose 'hidden' class is to be toggled.
*/
function toggleHidden(element) {
    if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
    } else {
        element.classList.add("hidden")
    }
}



//********************Chart Player*******************************
//These function are all related to  chart creation and population.

/**
* Creates a graph of the user-chosen stat for the user-chosen player.
* @param {Object} player - An array of dictionaries containing all player information.
* @param {String} stat - The statistical category (e.g., 'gp' or 'min') that is to be graphed.
*/
function makeChart(player, stat) {
    yearsPlayed = player[3]["total_years"].length;
	toGraphX = "year";
	toGraphY = stat;
	xAxis = makeAxis(yearsPlayed, player, toGraphX);
	yAxis = makeAxis(yearsPlayed, player, toGraphY);
	Plotly.newPlot( chart, [{
	x: xAxis,
	y: yAxis }], {
	margin: { t: 0 } } );
}

/**
* makeAxis is called by makeChart to create the axes used in making said chart.
* @param {Number} yearsPlayed - The number of seasons played by this player.
* @param {Object} player - An array of dictionaries containing all player information.
* @param {String} toGraph - The stat the user is graphing.
* @return {Object} - An array of axes used by makeChart to create the graph.
*/
function makeAxis(yearsPlayed, player, toGraph) {
    let axes = [];
    for (let i = 0; i < yearsPlayed; i++) {
        let axis = player[3]["total_years"][i][toGraph];
        axis = adjustAxis(axis, toGraph)
        axes.push(axis);
    }
    return axes;
}

/**
adjustAxis is called by makeAxis; it adjusts year values to read as a single year and '-' values to read as zero.
@param {*} axis - The value of the stat/column currently being assigne an axis value.
@param {String} toGraph - The stat/column currently being assigned an axis value.
@return {*} - The axis value after adjustment.
*/
function adjustAxis(axis, toGraph) {
    if (!axis) {
        axis = 0;
    }
    if (toGraph === "year") {
        if (axis === "1999-00") {
            axis = "2000";
        } else {
            axis = axis.slice(0, 2) + axis.slice(-2);
        }
    }
    return axis
}


//***************Random Player**************************

const randomPlayer = async() => {
    const playerRes = await fetchData();
    const playerData = await playerRes.json();
    createLink(playerData);
    const [careerTotals, yearlyTotals] = getStats(playerData);
    deletePreviousData();
    if (careerTotals) {
        createAndPopulateTable(careerTotals, yearlyTotals);
        if (graphingBtn.classList.contains("hidden")) {
            toggleHidden(graphingBtn);
        }
    } else {
        toggleHidden(graphingBtn)
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


//********************Basic player data functions********************

/**
* Populates the player name and creates the link for the randomPlayerLink anchor tag.
* @param {Object} data - An array of the player's statistical data.
*/
function createLink(data) {
    console.log(data)
    const fullName = data[0]["first_name"] + " " + data[0]["last_name"];
    randPlayerLink.href = data[0]['bb_ref_link'];
    randPlayerLink.innerText = fullName;
}


/**
* Retrieves the players career and year-to-year statistical data.
* @param {Object} data - An array of the player's statistical data.
* return {Object} - An array containing the player's career and year-to-year statistical data.
*/
function getStats(data){
    let careerTotals = null;
    let yearlyTotals = null;
    if (data[2]) {
        careerTotals = data[1];
        yearlyTotals = data[2]["all_years"];
    }
    return [careerTotals, yearlyTotals];
}


/**
* Removes all empty <tr> elements and all present <td> elements from the player table.
*/
function deletePreviousData() {
    const dataPresent = document.querySelectorAll(".tableData") != [];
    const toDelete = document.querySelectorAll(".yearlyPlayerDataRow");
    for (i = 1; i < toDelete.length; i++) {
        toDelete[i].remove();
    }
    if (dataPresent) {
        const tableData = document.querySelectorAll(".tableData");
        for (let i = 0; i < tableData.length; i++) {
            tableData[i].remove();
        }
    }
}


//********************Rando player table creation functions********************

/**
* Calls three other functions that create and populate the player stat table.
* @param {Object} careerTotals - A player's career statistical data.
* @param {Object} yearlyTotals - An array of a player's year-to-year statistical data.
*/
function createAndPopulateTable(careerTotals, yearlyTotals) {
    createTableRowHeaders(careerTotals, yearlyTotals[0]);
    createTableData(careerTotals, careerTableData);
    createYearlyTotalsRows(yearlyTotals);
}


/**
* This function checks if headers have been created and, if not, calls the function that creates and populates
* the two rows of <th> elements.
* @param {Object} careerTotals - A dictionary of table columns headers
* @param {Object} yearlyTotals - An array of dictionaries of table columns headers
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


/**
* This function creates, populates, and inserts each <td> element for the player table.
* @param {Object} data - The player's statistical data.
* @param {Object} table - The html table the player data is to be added to.
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


function createYearlyTotalsRows(yearlyTotals) {
    for (let i = 0; i < yearlyTotals.length; i++) {
//        if (i != 0) {
        const newRow = document.createElement("tr");
        newRow.classList.add("yearlyPlayerDataRow");
        yearlyTable.insertAdjacentElement("beforeend", newRow);
//        }
        const yearlyTableData = document.querySelectorAll(".yearlyPlayerDataRow");
        createTableData(yearlyTotals[i], yearlyTableData[yearlyTableData.length - 1]);
    }
}


/**
* Creates, names, and inserts each <th> element for the player table.
* @param {Object} data - A dictionary of player data
* @param {Object} row - The specific table row in the html file to which this element is added.
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
