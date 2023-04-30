//function revealRandomPlayer() {
//    document.getElementById('randomPlayerReveal').onclick = function () {
//        if (document.getElementById('randomPlayer').className === "hidden") {
//            document.getElementById('randomPlayer').classList.remove('hidden')
//        }
//    }
//}

function revealRandomPlayer() {
    toShow = document.getElementById('randomPlayer');
    toShow.classList.remove('hidden');
}