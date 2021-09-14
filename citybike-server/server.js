const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
var cors = require("cors");
const {
  loadAvailableBikes,
  getAvailableBikes,
  getAvailableBikesByTime,
} = require("./services/cityBikes");

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();

app.use(cors());

app.use(index);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
}); // < Interesting!

let interval;

io.on("connection", async (socket) => {
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
  console.log("New connection " + socketId + " from " + clientIp);

  socket.emit("available-bikes", loadAvailableBikes(socket));

  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getAvailableBikes(socket), 60000);

  socket.on("re-play", (timeId) => getAvailableBikesByTime(socket, timeId));

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
