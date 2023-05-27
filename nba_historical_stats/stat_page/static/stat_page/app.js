
const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
randomPlayerBtn.addEventListener("click", revealRandomPlayer)

function revealRandomPlayer() {
    toShow = document.querySelector("#randomPlayer");
    toShow.classList.remove('hidden');


//    fetch('/rando_json', {
    fetch('rando_json/', {
        headers:{
            'Content-Type': 'application/json'
        }
//        headers:{
//            'Accept': 'application/json',
//            'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
//        },
    })
    .then(response => {
        console.log(response)
    })
    .then(response => {
        return response.json() //Convert response to JSON
    })
    .then(data => {
        console.log(data)
    })
}