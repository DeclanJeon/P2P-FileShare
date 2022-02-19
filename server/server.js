const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);

const io = require("socket.io")(server);

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "../public/css")));
app.use(express.static(path.join(__dirname, "../public/scripts")));
app.use(express.static(path.join(__dirname, "../views")));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/receiver", (req, res) => {
    res.render("receiver");
});

io.on("connection", (socket) => {
    socket.on("sender-join", (data) => {
        socket.join(data.uid);
    });
    socket.on("receiver-join", (data) => {
        socket.join(data.uid);
        socket.in(data.sender_uid).emit("init", data.uid);
    });
    socket.on("file-meta", (data) => {
        socket.in(data.uid).emit("fs-meta", data.metadata);
    });
    socket.on("fs-start", (data) => {
        socket.in(data.uid).emit("fs-share", {});
    });
    socket.on("file-raw", (data) => {
        socket.in(data.uid).emit("fs-share", data.buffer);
    });
});

server.listen(port, () => {
    console.log(`Server Listener ${port}`);
});
