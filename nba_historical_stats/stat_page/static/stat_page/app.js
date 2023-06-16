//Table creation functions
function createTableRowHeaders(data, row) {
    const rowNames = Object.keys(data)
    for (let i = 1; i < rowNames.length; i++) {
        const colName = document.createElement("th");
        colName.classList.add("tableHeader")
        colName.innerText = rowNames[i];
        row.insertAdjacentElement("beforeend", colName)
    }
}

function deletePreviousData(dataPresent) {
    if (dataPresent) {
        tableData = document.querySelectorAll(".tableData");
        for (let i = 0; i < tableData.length; i++) {
            tableData[i].remove()
        }
    }
}


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

function deleteOldRows() {
    const toDelete = document.querySelectorAll(".yearlyPlayerDataRow");
    for (i = 1; i < toDelete.length; i++) {
        toDelete[i].remove();
    }
}


//Random player button functionality
//Add async functionality?
function revealRandomPlayer() {
    const toShow = document.querySelector("#randomPlayer");
    toShow.classList.remove('hidden');
    const anchorTag = document.querySelector("#randomPlayerLink");
    const careerTableColNames = document.querySelector("#careerPlayerRowNames");
    const careerTableData = document.querySelector("#careerPlayerDataRow")
    const yearlyTableColNames = document.querySelector("#yearlyPlayerRowNames")
    const yearlyTable = document.querySelector("#playerYearly")

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
        fullName = data[0]["first_name"] + " " + data[0]["last_name"]
        anchorTag.href = data[0]['bb_ref_link']
        anchorTag.innerText = fullName

        careerTotals = data[1]
        yearlyTotals = data[2]["all_years"]
        const dataPresent = document.querySelectorAll(".tableData") != [];

        if (dataPresent) {
            deletePreviousData(dataPresent)
        }
        if (careerTotals) {
            const headersNeeded = document.querySelectorAll(".tableHeader").length == 0;
            if (headersNeeded) {
                createTableRowHeaders(careerTotals, careerTableColNames);
                createTableRowHeaders(yearlyTotals[0], yearlyTableColNames);
            }

            createTableData(careerTotals, careerTableData);
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
    })
}

const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
randomPlayerBtn.addEventListener("click", revealRandomPlayer)



