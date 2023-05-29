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
    "ATL": ["#C8102E", "#FDB927", "https://content.sportslogos.net/logos/6/220/thumbs/22081902021.gif"],
    "BOS": ["#007A33", "#BA9653", "https://content.sportslogos.net/logos/6/213/thumbs/slhg02hbef3j1ov4lsnwyol5o.gif"],
    "CLE": ["#860038", "#FDBB30", "https://content.sportslogos.net/logos/6/222/thumbs/22253692023.gif"],
    "NOP": ["#0C2340", "#85714D", "https://content.sportslogos.net/logos/6/4962/thumbs/496226812014.gif"],
    "CHI": ["#CE1141", "#000000", "https://content.sportslogos.net/logos/6/221/thumbs/hj3gmh82w9hffmeh3fjm5h874.gif"],
    "DAL": ["#00538C", "#B8C4CA", "https://content.sportslogos.net/logos/6/228/thumbs/22834632018.gif"],
    "DEN": ["#0E2240", "#FEC524", "https://content.sportslogos.net/logos/6/229/thumbs/22989262019.gif"],
    "GSW": ["#1D428A", "#FFC72C", "https://content.sportslogos.net/logos/6/235/thumbs/23531522020.gif"],
    "HOU": ["#CE1141", "#000000", "https://content.sportslogos.net/logos/6/230/thumbs/23068302020.gif"],
    "LAC": ["#C8102E", "#1D428A", "https://content.sportslogos.net/logos/6/236/thumbs/23637762019.gif"],
    "LAL": ["#552583", "#FDB927", "https://content.sportslogos.net/logos/6/237/thumbs/uig7aiht8jnpl1szbi57zzlsh.gif"],
    "MIA": ["#98002E", "#000000", "https://content.sportslogos.net/logos/6/214/thumbs/burm5gh2wvjti3xhei5h16k8e.gif"],
    "MIL": ["#00471B", "#EEE1C6", "https://content.sportslogos.net/logos/6/225/thumbs/22582752016.gif"],
    "MIN": ["#0C2340", "#9EA2A2", "https://content.sportslogos.net/logos/6/232/thumbs/23296692018.gif"],
    "BKN": ["#000000", "#FFFFFF", "https://content.sportslogos.net/logos/6/3786/thumbs/hsuff5m3dgiv20kovde422r1f.gif"],
    "NYK": ["#006BB6", "#F58426", "https://content.sportslogos.net/logos/6/216/thumbs/2nn48xofg0hms8k326cqdmuis.gif"],
    "ORL": ["#0077C0", "#C4CED4", "https://content.sportslogos.net/logos/6/217/thumbs/wd9ic7qafgfb0yxs7tem7n5g4.gif"],
    "IND": ["#002D62", "#FDBB30", "https://content.sportslogos.net/logos/6/224/thumbs/22448122018.gif"],
    "PHI": ["#006BB6", "#FFFFFF", "https://content.sportslogos.net/logos/6/218/thumbs/21870342016.gif"],
    "PHX": ["#1D1160", "#E56020", "https://content.sportslogos.net/logos/6/238/thumbs/23843702014.gif"],
    "POR": ["#E03A3E", "#000000", "https://content.sportslogos.net/logos/6/239/thumbs/23997252018.gif"],
    "SAC": ["#5A2D81", "#63727A", "https://content.sportslogos.net/logos/6/240/thumbs/24040432017.gif"],
    "SAS": ["#C4CED4", "#000000", "https://content.sportslogos.net/logos/6/233/thumbs/23325472018.gif"],
    "OKC": ["#007AC1", "#EF3B24", "https://content.sportslogos.net/logos/6/2687/thumbs/khmovcnezy06c3nm05ccn0oj2.gif"],
    "TOR": ["#CE1141", "#000000", "https://content.sportslogos.net/logos/6/227/thumbs/22770242021.gif"],
    "UTA": ["#002B5C", "#00471B", "https://content.sportslogos.net/logos/6/234/thumbs/23485132023.gif"],
    "MEM": ["#5D76A9", "#12173F", "https://content.sportslogos.net/logos/6/231/thumbs/23143732019.gif"],
    "WAS": ["#002B5C", "#E31837", "https://content.sportslogos.net/logos/6/219/thumbs/21956712016.gif"],
    "DET": ["#C8102E", "#1D42BA", "https://content.sportslogos.net/logos/6/223/thumbs/22321642018.gif"],
    "CHA": ["#1D1160", "#00788C", "https://content.sportslogos.net/logos/6/5120/thumbs/512019262015.gif"],
}

//Color assigner for team links
window.addEventListener('load', (event) => {
    teamLinks = document.querySelectorAll(".teamLink")
    for (let i = 0; i < teamLinks.length; i++) {
        teamLinks[i].style.color = teamColors[teamLinks[i].innerText][0];
        teamLinks[i].style.backgroundColor = teamColors[teamLinks[i].innerText][1];
        teamLinks[i].style.backgroundImage = `url(${teamColors[teamLinks[i].innerText][2]})`;
        teamLinks[i].style.backgroundPosition = 'center center'
    }
})
//window.addEventListener('load', (event) => {
//    teamLinks = document.querySelectorAll(".teamLink")
//    for (let i = 29; i < teamLinks.length; i++) {
//        console.log(teamColorsAndLogos[teamLinks[i].innerText][0])
//        teamLinks[i].style.color = teamColorsAndLogos[teamLinks[i].innerText][0];
//        teamLinks[i].style.backgroundColor = teamColorsAndLogos[teamLinks[i].innerText][1];
//    }
//})

