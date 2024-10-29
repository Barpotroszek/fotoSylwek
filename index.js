const { createServer } = require("http"),
  express = require("express"),
  multer = require("multer");

const path = require("path");
const { Server } = require("socket.io");
const fs = require("fs");

const IMGS_FILE_PATH =path.join(__dirname, "imgs", "files.txt")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "imgs"); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Use unique filename
  },
});

const upload = multer({ storage });

const app = express(),
  server = createServer(app),
  io = new Server(server);

app.post("/upload", upload.single("file"), (req, res) => {
  console.log("PHOTO!!!");
  if (req.file) {
    const name = req.file.filename;
    fs.appendFile(IMGS_FILE_PATH, "\n" + name, () => {});
    res.send(`File received (I hope)`);
    io.emit("new-image", name);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.get("/control-panel", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "control-panel.html"));
});

app.get("/upload-photo", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "send-photo.html"));
});

app.use("/imgs", express.static("imgs"));
app.use(
  "/lib/socket.io",
  express.static("node_modules/socket.io/client-dist/")
);
app.use(express.static("client"));

io.on("connection", async (socket) => {
  console.log("New socket connected!");
  socket.on("delete", (name)=>{
    console.log("Deleting: ", name)
    const dt = fs.readFileSync(IMGS_FILE_PATH).toString();
    let r = dt.split('\n'),
    x = r.findIndex(f=>name==f)
    r.splice(x, 1);
    r = r.join('\n')
    fs.writeFile(IMGS_FILE_PATH, r,()=>{})
    io.emit("update-files-list", x)
  })
});

server.listen(3000, () => {
  console.log("Server listening: 3000");
});
