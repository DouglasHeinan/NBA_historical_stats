
const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
randomPlayerBtn.addEventListener("click", revealRandomPlayer)

function revealRandomPlayer() {


    axios.get("{% randPlayer %}")
    .then((res) => {
        console.log("RESPONSE ", res);
    })
    .catch(e => {
        console.log("ERROR ", e);
    })


    console.log("here")
    toShow = document.getElementById('randomPlayer');
    toShow.classList.remove('hidden');
}



