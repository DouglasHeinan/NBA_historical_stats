
const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
randomPlayerBtn.addEventListener("click", revealRandomPlayer)

function revealRandomPlayer() {
    toShow = document.querySelector("#randomPlayer");
    toShow.classList.remove('hidden');
//************************************************************




    fetch('http://localhost:8000/stat-page/rando_json/')
        .then(data => console.log(data));


}



