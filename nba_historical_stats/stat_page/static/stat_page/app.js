//Table creation functions
function createTableRowHeaders(data) {
    const headersNeeded = document.querySelectorAll(".tableHeader").length == 0;
//    const testTest = document.querySelectorAll(".tableHeader")
    if (headersNeeded) {
        const rowNames = Object.keys(data)
            for (let i = 1; i < rowNames.length; i++) {
                const colName = document.createElement("th");
                colName.classList.add("tableHeader")
                colName.innerText = rowNames[i];
                careerTableColNames.insertAdjacentElement("beforeend", colName)
        }
    }
}

function createTableRowData(data) {
    const rowData = Object.values(data)
    const dataPresent = document.querySelectorAll(".tableData") != [];
    if (dataPresent) {
        tableData = document.querySelectorAll(".tableData");
        for (let i = 0; i < tableData.length; i++) {
            tableData[i].remove()
        }
    }
    for (let i = 1; i < rowData.length; i++) {
        const colData = document.createElement("td");
        colData.classList.add("tableData")
        colData.style.textAlign = "center";
        if (!rowData[i]) {
            rowData[i] = '-'
        }
        colData.innerText = rowData[i];
        careerTableData.insertAdjacentElement("beforeend", colData)
    }
}

//Random player button functionality
//Add async functionality?
function revealRandomPlayer() {
    toShow = document.querySelector("#randomPlayer");
    toShow.classList.remove('hidden');
    anchorTag = document.querySelector("#randomPlayerLink");
    careerTableColNames = document.querySelector("#careerRowNames");
    careerTableData = document.querySelector("#careerDataRow")

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

        has_value = data[1]
        if (has_value) {
            createTableRowHeaders(data[1]);
            createTableRowData(data[1]);
            console.log(data[2])
        }
    })
}

const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
randomPlayerBtn.addEventListener("click", revealRandomPlayer)



