const axios = require("axios").default;
const { loadBikes, renameFile, storeBikes } = require("../db/db");
const { checkIfTimestampChange } = require("./helpers");

const citybikeurl = "http://api.citybik.es/v2/networks/decobike-miami-beach";

const loadAvailableBikes = async (socket) => {
  try {
    const reponse = await axios.get(citybikeurl);
    const citybikesData = reponse?.data?.network;
    await storeBikes(citybikesData);
    socket.emit("available-bikes", citybikesData);
  } catch (error) {
    console.log(error);
  }
};

const getAvailableBikes = async (socket) => {
  try {
    const reponse = await axios.get(citybikeurl);
    const citybikesData = reponse?.data?.network;

    socket.emit("available-bikes", citybikesData);

    compareWithLastAvailableBikes(citybikesData);
    return citybikesData;
  } catch (error) {
    console.log(error);
  }
};

const compareWithLastAvailableBikes = async (citybikesData) => {
  const loadedBikes = await loadBikes();
  if (!loadedBikes) return;

  const { stations: currentStations } = citybikesData;
  const { stations: loadedSaved, updatesCount = 0 } = loadedBikes;
  const stationsWereUpdated = checkIfTimestampChange(
    currentStations,
    loadedSaved
  );

  if (stationsWereUpdated) {
    const newCount = updatesCount + 1;
    const newFileName = `available-bikes-${newCount}.json`;
    await renameFile(newFileName);
    const newBikes = { ...citybikesData, updatesCount: newCount };
    await storeBikes(newBikes);
  }
};

const getAvailableBikesByTime = async (socket, timeId) => {
  const fileName = `available-bikes-${timeId}.json`;
  let loadedBikes = await loadBikes({ fileName });

  if (!loadedBikes) {
    loadedBikes = await loadBikes();
  }
  socket.emit("available-bikes-by-time", loadedBikes);
};

module.exports = {
  getAvailableBikes,
  getAvailableBikesByTime,
  loadAvailableBikes,
};
