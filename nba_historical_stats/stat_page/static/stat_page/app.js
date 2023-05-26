
const randomPlayerBtn = document.querySelector("#randomPlayerReveal");
randomPlayerBtn.addEventListener("click", revealRandomPlayer)

function revealRandomPlayer() {
    toShow = document.querySelector("#randomPlayer");
    toShow.classList.remove('hidden');
//************************************************************

//    fetch('http://127.0.0.1:8000/stat-page/rando_json/')
//        .then(data => console.log(data));

}


//
//async function revealRandomPlayer() {
//    const response = await fetch('http://127.0.0.1:8000/stat-page/rando_json/')
//    const jsonData = await response.json();
//    console.log(jsonData);
//}


  fetch('/rando_json')
      .then(function (response) {
          return response.json();
      }).then(function (text) {
          console.log('GET response:');
          console.log(text.greeting);
      });