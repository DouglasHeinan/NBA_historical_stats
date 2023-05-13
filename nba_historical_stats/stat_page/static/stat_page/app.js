{% allPlayers = players %}

const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
randomPlayerBtn.addEventListener("click", revealRandomPlayer)

function revealRandomPlayer() {
    randIndex = Math.floor(Math.random() * 4000) + 1;
    randPlayer = allPlayers[randIndex];
    console.log(randPlayer.first_name)
    return randPlayer
}

//    toShow = document.getElementById('randomPlayer');
//    toShow.classList.remove('hidden');