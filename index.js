const { createServer } = require("http"),
  express = require("express"),
  multer = require("multer");

const path = require("path");
const { Server } = require("socket.io");
const fs = require("fs");

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
    fs.appendFile("imgs/files.txt", "\n" + name, () => {});
    res.send(`File received (I hope)`);
    io.emit("new-image", name);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
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

io.on("connection", (socket) => {
  console.log("New socket connected!");
});

server.listen(3000, () => {
  console.log("Server listening: 3000");
});
