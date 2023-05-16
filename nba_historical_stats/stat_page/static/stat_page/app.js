
const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
randomPlayerBtn.addEventListener("click", revealRandomPlayer)

function revealRandomPlayer() {
console.log("here")
    toShow = document.getElementById('randomPlayer');
    toShow.classList.remove('hidden');
}



