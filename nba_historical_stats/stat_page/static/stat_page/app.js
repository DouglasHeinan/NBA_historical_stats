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

//Random player button functionality
//Add async functionality?
function revealRandomPlayer() {
    toShow = document.querySelector("#randomPlayer");
    toShow.classList.remove('hidden');
    anchorTag = document.querySelector("#randomPlayerLink");
    careerTableColNames = document.querySelector("#careerPlayerRowNames");
    careerTableData = document.querySelector("#careerPlayerDataRow")
    yearlyTableColNames = document.querySelector("#yearlyPlayerRowNames")

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
                    const newRow = document.createElement("td");
                    NewRow.classList.add("yearlyPlayerDataRow")
                }
                yearlyTableData = document.querySelectorAll(".yearlyPlayerDataRows")
                createTableData(yearlyTotals[i], yearlyTableData[-1])
            }
        }
    })
}

const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
randomPlayerBtn.addEventListener("click", revealRandomPlayer)



