const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
randomPlayerBtn.addEventListener("click", revealRandomPlayer)

function revealRandomPlayer() {
    toShow = document.getElementById('randomPlayer');
    toShow.classList.remove('hidden');
}

