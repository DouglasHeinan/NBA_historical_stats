//Table creation functions
function createTableRowHeaders(data) {
        rowNames = data["player_career_stats"]["resultSets"][1]["headers"]
        for (let i = 0; i < rowNames.length; i++) {
            const colName = document.createElement("th");
            colName.innerText = rowNames[i];
            careerTableColNames.insertAdjacentElement("beforeend", colName)
        }
}

function createTableRowData(data) {
    rowData = data["player_career_stats"]["resultSets"][1]["rowSet"][0]
    for (let i = 0; i < rowData.length; i++) {
        const colData = document.createElement("td");
        colData.innerText = rowData[i];
        console.log(rowData[i])
        careerTableData.insertAdjacentElement("beforeend", colData)
    }
}

//Random player button/onload functionality
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
        fullName = data["first_name"] + " " + data["last_name"]
        anchorTag.href = data['bb_ref_link']
        anchorTag.innerText = fullName
        createTableRowHeaders(data)
        createTableRowData(data)
    })
}

//Random player triggers
const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
randomPlayerBtn.addEventListener("click", revealRandomPlayer)
window.addEventListener('load', (event) => {
    revealRandomPlayer()
    }
)


