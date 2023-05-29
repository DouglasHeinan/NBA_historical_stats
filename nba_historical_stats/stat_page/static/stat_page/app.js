//Random player button/onload functionality
function revealRandomPlayer() {
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
//Random player triggers
const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
randomPlayerBtn.addEventListener("click", revealRandomPlayer)
window.addEventListener('load', (event) => {
    revealRandomPlayer()
    }
)
