const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
var cors = require("cors");
const { getAvailableBikes } = require("./services/cityBikes");

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const { constants } = require("fs");
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

io.on("connection", async (socket) => {
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
  console.log("New connection " + socketId + " from " + clientIp);

  const availableBikes = await getAvailableBikes();
  io.emit("available-bikes", availableBikes);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
