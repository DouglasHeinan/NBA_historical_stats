
const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
randomPlayerBtn.addEventListener("click", revealRandomPlayer)

function revealRandomPlayer() {
    toShow = document.querySelector("#randomPlayer");
    toShow.classList.remove('hidden');
//************************************************************
    axios.get("{% rando_json/ %}")
    .then((res) => {
        console.log("RESPONSE ", res);
    })
    .catch(e => {
        console.log("ERROR ", e);
    })



//    fetch('http://localhost:8000/rando_json')
//        .then(data => console.log(data));


}



