
const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
randomPlayerBtn.addEventListener("click", revealRandomPlayer)

function revealRandomPlayer() {
    toShow = document.querySelector("#randomPlayer");
    toShow.classList.remove('hidden');



    axios.get("{% views.rando_player %}")
    .then((res) => {
        console.log("RESPONSE ", res);
    })
    .catch(e => {
        console.log("ERROR ", e);
    })



}



