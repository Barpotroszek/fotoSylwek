// const socket = io();

function uploadImg() {
  const progressBar = document.getElementById("progress-bar");
  const thanks = document.getElementById("thanks");
  const input = document.createElement("input");
  input.name = "file";
  input.type = "file";
  input.accept = "image/*";
  
  progressBar.classList.add("hidden");
  thanks.classList.add("hidden");

  input.addEventListener("change", (e) => {
    if (input.files.length == 0) return;

    const form = new FormData();
    form.append("file", input.files[0]);

    const xhr = new XMLHttpRequest();

    xhr.addEventListener("progress", (e) => {
      const progress = (e.loaded / e.total) * 100;
      progressBar.style = "--progress: " + progress + "%";
      progressBar.textContent = progress + "%";
      console.log(progress + "% loaded");
    });

    xhr.onloadstart = ()=>{
      progressBar.classList.remove("hidden");
    }
    xhr.onloadend = (e) => {
      thanks.classList.remove("hidden");
    };

    xhr.open("POST", "/upload");
    xhr.send(form);
  });
  input.click();
}
