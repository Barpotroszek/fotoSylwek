function spawnStar() {
  const MAX_X = window.outerWidth,
   MAX_Y = window.outerHeight;

  const star = document.createElement("span");
  star.setAttribute("class", "star");

  const x = Math.floor((Math.random() * 3000) % MAX_X),
    y = Math.floor((Math.random() * 3000) % MAX_Y);
  star.setAttribute("style", "--pos-x: " + x + "px; --pos-y: " + y + "px");;
  document.body.append(star);
  setTimeout(()=>star.remove(), 8000)
}

function megaStarSpawner(){
    for(let i=0; i<7; i++)
        spawnStar()
}

setInterval(megaStarSpawner, 400)