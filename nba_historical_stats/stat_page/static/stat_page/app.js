//Random player button functionality
function revealRandomPlayer() {
    const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
    randomPlayerBtn.addEventListener("click", revealRandomPlayer)
    toShow = document.querySelector("#randomPlayer");
    toShow.classList.remove('hidden');
    anchorTag = document.querySelector("#randomPlayerLink");

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
    })
}

//Dict of team colors for function below.
teamColors = {
    "ATL": ["#C8102E", "#FDB927"],
    "BOS": ["#007A33", "#BA9653"],
    "CLE": ["#860038", "#FDBB30"],
    "NOP": ["#0C2340", "#85714D"],
    "CHI": ["#CE1141", "#000000"],
    "DAL": ["#00538C", "#B8C4CA"],
    "DEN": ["#0E2240", "#FEC524"],
    "GSW": ["#1D428A", "#FFC72C"],
    "HOU": ["#CE1141", "#000000"],
    "LAC": ["#C8102E", "#1D428A"],
    "LAL": ["#552583", "#FDB927"],
    "MIA": ["#98002E", "#000000"],
    "MIL": ["#00471B", "#EEE1C6"],
    "MIN": ["#0C2340", "#9EA2A2"],
    "BKN": ["#000000", "#FFFFFF"],
    "NYK": ["#006BB6", "#F58426"],
    "ORL": ["#0077C0", "#C4CED4"],
    "IND": ["#002D62", "#FDBB30"],
    "PHI": ["#006BB6", "#FFFFFF"],
    "PHX": ["#1D1160", "#E56020"],
    "POR": ["#E03A3E", "#000000"],
    "SAC": ["#5A2D81", "#63727A"],
    "SAS": ["#C4CED4", "#000000"],
    "OKC": ["#007AC1", "#EF3B24"],
    "TOR": ["#CE1141", "#000000"],
    "UTA": ["#002B5C", "#00471B"],
    "MEM": ["#5D76A9", "#12173F"],
    "WAS": ["#002B5C", "#E31837"],
    "DET": ["#C8102E", "#1D42BA"],
    "CHA": ["#1D1160", "#00788C"],
}

//Color assigner for team links
//function assignTeamButtonColors() {
window.addEventListener('load', (event) => {
    teamLinks = document.querySelectorAll(".teamLink")
//    console.log(teamLinks)
    for (let i = 0; i < teamLinks.length; i++) {
        console.log(teamColors[teamLinks[i].innerText][0])
        teamLinks[i].style.color = teamColors[teamLinks[i].innerText[0]];
        teamLinks[i].style.backgroundColor = teamColors[teamLinks[i].innerText[1]];
    }
})

//}
