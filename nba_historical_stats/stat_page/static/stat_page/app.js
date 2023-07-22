//********************Query Selectors********************


const selectedPlayers = document.querySelector(".playersToGraph");
const leftPlayerDiv = document.querySelector("#leftPlayerDiv");
const rightPlayerDiv = document.querySelector("#rightPlayerDiv");
const compBtnDiv = document.querySelector(".compBtnDiv");
const compBtn = document.querySelector("#compBtn");
const compHeader = document.querySelector("#compHeader");
const hideForComp = document.querySelector("#hideForComp");
const singlePlayer = document.querySelector("#onePlayerOnly");
const playerLink = document.querySelector("#playerLink");
const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
const graphingBtn = document.querySelector("#makeChart");
const careerTableData = document.querySelector("#careerPlayerDataRow");
const yearlyTable = document.querySelector("#playerYearly");
const graphTypeBtn = document.querySelector("#selectChartType");
const dropdownDiv = document.querySelector(".dropdownOptions");
const dropBtns = document.querySelectorAll(".statDrop");
const chart = document.querySelector("#plot");
const searchBtn = document.querySelector("#searchBtnOne");
const searchInput = document.querySelector("#searchInputOne");
const searchResultsList = document.querySelector("#searchedPlayerList");
const nameList = document.querySelector("#listPlayerNames");
const compList = document.querySelector("#listCompNames");
const namesDiv = document.querySelector("#divPlayerNames");
const compDiv = document.querySelector("#divCompNames");
const tables = document.querySelectorAll(".tableDiv");


//********************Global Variables******************


let curPlayer = null;
const statBtnLength = dropBtns.length;
const fetchHeaders = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' //Necessary to work with request.is_ajax()
}


//***********************Event Listeners***************
//GIVE NOTES FOR EL?

searchBtn.addEventListener("click", async() => {
    curPlayer = await retrievePlayer(fetchSearchedPlayer, false, searchInput.value);
    chart.classList.add("hidden");
    dropdownDiv.classList.add("hidden");
})


randomPlayerBtn.addEventListener("click", async() => {
    curPlayer = await retrievePlayer(fetchRandPlayer, false);
    chart.classList.add("hidden");
    dropdownDiv.classList.add("hidden");
})


graphingBtn.addEventListener("click", function() {
    toggleHidden(dropdownDiv);
})


compBtn.addEventListener("click", revealRightSideName)


nameList.addEventListener("click", retrieveClickedPlayer)


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


//********************Player stat charting*******************************
//These functions are all related to chart creation and population for single player stats.


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
@param {*} axis - The value of the stat/column currently being assigned an axis value.
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


//*****************Player retrieval***************************
//Functions that retrieve player data from the database.


/**
* This callback is used to retrieve player data.
* @callback fetchFunc - The fetch function is used to retrieve the player or players' info (e.g.: fetchRandPlayer()).
* @param {Object} [optionalArg] - An argument passed to the callback function; some callbacks require an argument.
*/

/**
* Calls functions to clear screen of data from previous retrievals and calls fetch functions to retrieve data
* for a new player or players.
* @param {function} fetchFunc - The callback
* @param {Object} [optionalArg] - An optional argument for the callback.
* return {Object} - An array-like object containing all available information for a single player.
*/
async function retrievePlayer(fetchFunc, comp, ...optionalArg) {
    deleteLastSearch();
    deleteTableData();
    const playerRes = await fetchFunc(optionalArg);
    const playerData = await playerRes.json();
    console.log(playerData);
    if (playerData[0]["one_player"] == true) {
        createPlayerPage(playerData);
        return playerData;
    } else {
        hideTables();
        if (comp) {
            splitScreen()
        } else {
            createPlayerLinkList(playerData);
        }
    }
}


/**
* An async function that retrieves a python dictionary of a random player's information and
* statistices from the 'rando_player/' function in views.py.
* @return {Object} - The response (a promise) from the API.
*/
async function fetchRandPlayer() {
    const playerRes = await fetch('rando_player/', {
        headers:fetchHeaders
    });
    return playerRes;
}


/**
* An async function that retrieves a python dictionary of a random player's information and
* statistices from the 'search_player/' function in views.py.
* @param {} searched - An array of all words from the user-input search box.
* @return {Object} - The response (a promise) from the API.
*/
async function fetchSearchedPlayer(searched) {
    const playerRes = await fetch(`search_player/${searched}`, {
        headers:fetchHeaders
    });
    return playerRes;
}


//********************Player search results page**********************
//Functions called to create and populate a search results page with multiple options.


/**
* Reveals elements of the page relevant to displaying search results; hides elements that are irrelevant.
*/
function hideTables() {
    namesDiv.classList.remove("hidden");
    playerLink.innerText = "";
    graphingBtn.classList.add("hidden");
    for (i = 0; i < tables.length; i++) {
        tables[i].classList.add("hidden");
    }
}


/**
* Calls the createPlayerPageLink function for each player returned as a result of a user search.
* @param {Object} playerData - An array of objects containing all player information.
*/
function createPlayerLinkList(playerData) {
    const players = Object.values(playerData[1])
    for (let i = 0; i < players.length; i++) {
        createPlayerPageLink(players[i]);
    }
}


/**
* Creates and populates all necessary elements for a single player's link/name to be
* displayed in a group of search results.
* @param {Object} player - An object containing all basic information for a single player.
*/
function createPlayerPageLink(player) {
    compBtnDiv.classList.remove("hidden");
    newListTag = document.createElement("li");
    newAnchorTag = document.createElement("a");
    fullName = player["first_name"] + " " + player["last_name"]
    newAnchorTag.classList.add("playerPage");
    newAnchorTag.innerText = fullName;
    newAnchorTag.href = "#";
    newListTag.classList.add("listedPlayer")
    newListTag.insertAdjacentElement("beforeend", newAnchorTag)
    nameList.insertAdjacentElement("beforeend", newListTag)
}


/**
* Called by the NameList eventListener, calls retrievePlayer(), passing the clicked player's name as the optionalArg.
*/
async function retrieveClickedPlayer(e) {
    if (e.target.className == "playerPage") {
        curPlayer = await retrievePlayer(fetchSearchedPlayer, false, e.target.innerText);
    }
}


function splitScreen() {
    singlePlayer.classList.add("halfPage");
}


//********************Player page creation********************
//Functions related to populating the page with the info for a single player.


/**
* Removes all empty <tr> elements and all present <td> elements from the player table.
*/
function deleteTableData() {
    const toDelete = document.querySelectorAll(".yearlyPlayerDataRow");
    for (i = 0; i < toDelete.length; i++) {
        toDelete[i].remove();
    }
    const tableData = document.querySelectorAll(".tableData");
    for (let i = 0; i < tableData.length; i++) {
        tableData[i].remove();
    }
}


/**
* Deletes all listed elements from a previous search result.
*/
function deleteLastSearch() {
    toDelete = document.querySelectorAll(".listedPlayer");
    toDelete.forEach(e => e.remove())
}


/**
* Calls the four functions that combine to populate the page with a single player's information and stats.
* @param {Object} playerData - An array-like object that contains all relevant data for a single player.
*/
function createPlayerPage(playerData) {
    createBBRefLink(playerData);
    const [careerTotals, yearlyTotals] = getStats(playerData);
    checkTotals(careerTotals, yearlyTotals);
    revealTables();
}


/**
* Populates the player name and creates the link for the retrievePlayerLink anchor tag.
* @param {Object} data - An array of the player's statistical data.
*/
function createBBRefLink(data) {
    const fullName = data[1]["first_name"] + " " + data[1]["last_name"];
    playerLink.href = data[1]['bb_ref_link'];
    playerLink.innerText = fullName;
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
* Toggles visibility of of the graphingBtn; calls table-creating function if necessary.
* @param {Object} careerTotals - A player's career statistics.
* @param {Object} yearlyTotals - An array of year-to-year player statistics.
*/
function checkTotals(careerTotals, yearlyTotals) {
    if (careerTotals) {
        createAndPopulateTable(careerTotals, yearlyTotals);
        if (graphingBtn.classList.contains("hidden")) {
            toggleHidden(graphingBtn);
        }
    } else {
        toggleHidden(graphingBtn)
    }
}


/**
* Removes 'hidden' class from all tables and the comparison button.
*/
function revealTables() {
    compBtnDiv.classList.remove("hidden");
    for (i = 0; i < tables.length; i++) {
        tables[i].classList.remove("hidden");
    }
}


function revealRightSideName() {
    splitScreen();
    rightPlayerDiv.classList.remove("hidden");
    const searchedName = prompt("Compare to whom?");
    hideForComp.classList.add("hidden");
    toggleHidden(compHeader);
    toggleHidden(compDiv);
    playerOne = curPlayer;
    retrievePlayer(fetchSearchedPlayer, true, searchedName);
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
