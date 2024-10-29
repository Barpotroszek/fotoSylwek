const FILES = new Array();
const socket = io();

const prompt_duration = 7000;
const cursor = {
  limit: FILES.length,
  current: Math.floor((Math.random() * 100) % 50),
  timeout: 7000,
};

const updateFilesList = () => {
  fetch("/imgs/files.txt").then((res) => {
    res.text().then((t) => {
      t.split("\n").forEach((f) => FILES.push(f));
      cursor.limit = FILES.length;
    });
  });
};

function alert(msg) {
  const prompt = document.createElement("div");
  prompt.classList.add("prompt");
  prompt.style = "--duration: " + prompt_duration / 1000 + "s";
  prompt.textContent = msg;
  document.body.append(prompt);
}

function uploadNextPhoto() {
  const div = document.createElement("div"),
    img = document.createElement("img");
  cursor.current = (cursor.current + 1) % cursor.limit;
  // console.log(FILES, cursor.current, img.src, FILES[cursor.current])
  img.onload = () => {
    div.setAttribute("class", "picture");
    div.setAttribute("id", cursor.current);
    div.appendChild(img);
    document.body.append(div);
    setTimeout(() => div.remove(), cursor.timeout);
  };
  img.onerror = () => {
    console.error("Plik not found, getting next");
    uploadNextPhoto();
  };
  img.src = "/imgs/" + FILES[cursor.current];

  return div;
}

setInterval(uploadNextPhoto, 8000);

socket.on("new-image", (filename) => {
  alert("Dodano nowe zdjęcie 😁");
  FILES.push(filename);
  cursor.limit = FILES.length;
});

socket.on("update-files-list", (x) => {
  console.log("Deleting: ", x)
  alert("Biblioteka zaktualizowana 🙄")
  FILES.splice(x, 1);
  cursor.limit = FILES.length;
});

updateFilesList();