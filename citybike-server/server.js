const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const index = require("./routes/index");
const {
  loadAvailableBikes,
  getCurrentAvailableBikes,
  getAvailableBikesByTime,
} = require("./services/cityBikes");

// To timestamps compare, "EDT" Miami
process.env.TZ = "EDT";
const port = process.env.PORT || 4001;
const app = express();

app.use(cors());

app.use(index);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "http://localhost:3000" },
});

let getCurrentAvailableBikesInterval;

io.on("connection", async (socket) => {
  const socketId = socket.id;
  const clientIp = socket.request.connection.remoteAddress;
  console.log("New connection " + socketId + " from " + clientIp);

  socket.emit("available-bikes", loadAvailableBikes(socket));

  if (getCurrentAvailableBikesInterval) {
    clearInterval(getCurrentAvailableBikesInterval);
  }
  getCurrentAvailableBikesInterval = setInterval(
    () => getCurrentAvailableBikes(socket),
    6000
  );

  socket.on("re-play", (timeRange) =>
    getAvailableBikesByTime(socket, timeRange)
  );

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
