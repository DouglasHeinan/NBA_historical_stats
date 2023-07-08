
//********************Query Selectors********************

const playerLinkDiv = document.querySelector("#playerLinkDiv");
const playerLink = document.querySelector("#playerLink");
const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
const graphingBtn = document.querySelector("#makeChart");
const careerTableData = document.querySelector("#careerPlayerDataRow");
const yearlyTable = document.querySelector("#playerYearly");
const graphTypeBtn = document.querySelector("#selectChartType");
const dropdownDiv = document.querySelector(".dropdownOptions");
const dropBtns = document.querySelectorAll(".statDrop");
const chart = document.querySelector("#plot");
const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");
const nameList = document.querySelector("#listPlayerNames");
const nameDiv = document.querySelector("#divPlayerNames");


//********************Global Variables******************

let curPlayer = null;
const statBtnLength = dropBtns.length;
const fetchHeaders = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' //Necessary to work with request.is_ajax()
}



//***********************Event Listeners***************
searchBtn.addEventListener("click", async() => {
    curPlayer = await retrievePlayer(fetchSearchedPlayer, searchInput.value);
    plot.classList.add("hidden");
})


randomPlayerBtn.addEventListener("click", async() => {
    curPlayer = await retrievePlayer(fetchRandPlayer);
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
//These function are all related to chart creation and population.


/**
* Creates a graph of the user-chosen stat for the user-chosen player.
* @param {Object} player - An array of dictionaries containing all player information.
* @param {String} stat - The statistical category (e.g., 'gp' or 'min') that is to be graphed.
*/
function makeChart(player, stat) {
    yearsPlayed = player[4]["total_years"].length;
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
        let axis = player[4]["total_years"][i][toGraph];
        axis = adjustAxis(axis, toGraph)
        axes.push(axis);
    }
    return axes;
}

/**
adjustAxis is called by makeAxis; it adjusts year values to read as a single year and '-' values to read as zero.
@param {*} axis - The value of the stat/column currently being assigne an axis value.
@param {String} toGraph - The stat/column currently being assigned an axis value.
@return {*} - The axis value after adjustment, could be a String or Number.
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


/**
* Calls functions that create links and tables for a random player.
*/
async function retrievePlayer(fetchFunc, ...optionalArg) {
    deletePreviousData();
    const playerRes = await fetchFunc(optionalArg);
    const playerData = await playerRes.json();
    if (playerData[0]["one_player"] == true) {
        toggleHidden(playerLinkDiv);
        createBBRefLink(playerData);
        const [careerTotals, yearlyTotals] = getStats(playerData);
        makeTables(careerTotals, yearlyTotals);
        return playerData;
    } else {
        hideTables();
        toggleHidden(nameDiv);
        for (player in playerData[1]) {
            createPlayerPageLink(player)
        }
    }
}


/**
* An async function that retrieves a python dictionary of a random player's information and
* statistices from the 'rando_json/' function in views.py.
* @return {Object} - The response (a promise) from the API.
*/
async function fetchRandPlayer() {
    const playerRes = await fetch('rando_player/', {
        headers:fetchHeaders
    });
    return playerRes;
}


/**
* If there is any player data, uses it to call the table-creating functions.
* Also toggles graphing button visibility as necessary.
* @param {Object} careerTotals - A player's career statistics.
* @param {Object} yearlyTotals - An array of year-to-year player statistics.
*/
function makeTables(careerTotals, yearlyTotals) {
    if (careerTotals) {
        createAndPopulateTable(careerTotals, yearlyTotals);
        if (graphingBtn.classList.contains("hidden")) {
            toggleHidden(graphingBtn);
        }
    } else {
        toggleHidden(graphingBtn)
    }
}


//***************************Player Search***************************

/**
NEEDS NOTES*******************
*/
async function fetchSearchedPlayer(searched) {
    const playerRes = await fetch(`search_player/${searched}`, {
        headers:fetchHeaders
    });
    return playerRes;
}


//********************Basic player data functions********************


/**
* Populates the player name and creates the link for the retrievePlayerLink anchor tag.
* @param {Object} data - An array of the player's statistical data.
*/
function createBBRefLink(data) {
    const fullName = data[1]["first_name"] + " " + data[1]["last_name"];
    playerLink.href = data[1]['bb_ref_link'];
    playerLink.innerText = fullName;
}


function createPlayerPageLink(player) {
    fullName = player["first_name"] + " " + player["last_name"]
    playerLink.classList.add = playerPage;
    playerLink.innerText = full_name;
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
        careerTotals = data[2];
        yearlyTotals = data[3]["all_years"];
    }
    return [careerTotals, yearlyTotals];
}


/**
* Removes all empty <tr> elements and all present <td> elements from the player table.
*/
function deletePreviousData() {
    if (playerLink.innerText) {
        toggleHidden(playerLinkDiv)
    }
    const toDelete = document.querySelectorAll(".yearlyPlayerDataRow");
    for (i = 0; i < toDelete.length; i++) {
        toDelete[i].remove();
    }
    const tableData = document.querySelectorAll(".tableData");
    for (let i = 0; i < tableData.length; i++) {
        tableData[i].remove();
    }
}


function hideTables() {
    const tables = document.querySelectorAll(".tableDiv");
    for (table in tables) {
        console.log(table)
        table.classList.add("hidden")
    }
}


//********************Table creation functions********************


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
* @param {Object} careerTotals - A player's total career statistics.
* @param {Object} yearlyTotals - An array of player year-to-year statistics.
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

/**
* Creates a row for each year of a player's career in the yearlyPlayerData table.
* @param {Object} yearlyTotals - An array of player year-to-year statistics.
*/
function createYearlyTotalsRows(yearlyTotals) {
    for (let i = 0; i < yearlyTotals.length; i++) {
        const newRow = document.createElement("tr");
        newRow.classList.add("yearlyPlayerDataRow");
        yearlyTable.insertAdjacentElement("beforeend", newRow);
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
