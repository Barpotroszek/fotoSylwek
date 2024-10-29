const socket = io()

async function emitDelete(name) {
    socket.emit("delete", name)
}

socket.on("update-files-list", ()=>window.location.reload())
function addItemToList(file) {
  const li = document.createElement("li"),
    div = document.createElement("div"),
    img = document.createElement("img"),
    btn = document.createElement("button");

  img.src = file;
  btn.classList.add("delete");
  btn.onclick = () => emitDelete(file);
  div.appendChild(img);
  div.appendChild(btn);
  li.appendChild(div);
  return li;
}

window.onload = () => {
  const list = document.querySelector("#panel>div");
  console.log({ list });
  fetch("/imgs/files.txt").then(async (f) => {
    const t = await f.text();
    const files = t.split("\n");
    const elems = files.reverse().map(async (file) => {
      const div = document.createElement("div"),
        img = document.createElement("img"),
        btn = document.createElement("button");

      img.setAttribute("loading", "lazy");
      img.src = "/imgs/" + file;
      btn.classList.add("delete", "border-white");
      btn.onclick = () => emitDelete(file);
      div.appendChild(img);
      div.appendChild(btn);
       list.append(div);
    });
  });
};
