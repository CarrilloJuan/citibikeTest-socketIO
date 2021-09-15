const axios = require("axios").default;

const { loadBikes, renameFile, storeBikes, removeFile } = require("../db/db");
const { checkIfStationsChange } = require("./helpers");
const { buildPath } = require("../utils/fs");

const CITY_BIKE_URL = "http://api.citybik.es/v2/networks/velib";

const loadAvailableBikes = async (socket) => {
  try {
    const reponse = await axios.get(CITY_BIKE_URL);
    const citybikesData = reponse?.data?.network;
    await storeBikes(citybikesData);
    socket.emit("available-bikes", citybikesData);
  } catch (error) {
    console.log(error);
  }
};

const getCurrentAvailableBikes = async (socket) => {
  try {
    const reponse = await axios.get(CITY_BIKE_URL);
    const citybikesData = reponse?.data?.network;

    socket.emit("available-bikes", citybikesData);

    compareWithLastAvailableBikes(citybikesData);
    return citybikesData;
  } catch (error) {
    console.log(error);
  }
};

const sortAvailablesBikesFiles = async () => {
  try {
    const [dataOldRangeTime, dataMiddleRangeTime] = await Promise.all([
      await loadBikes(buildPath({ fileName: "available-bikes-2.json" })),
      await loadBikes(buildPath({ fileName: "last-available-bikes.json" })),
    ]);

    // Override the oldest time range of available bikes
    const overrideOldestBucketPromise = storeBikes(
      dataOldRangeTime,
      buildPath({ fileName: "available-bikes-1.json" })
    );

    // Override the middle time range of available bikes
    const overrideMiddleBucketPromise = storeBikes(
      dataMiddleRangeTime,
      buildPath({ fileName: "available-bikes-2.json" })
    );

    await Promise.all([
      overrideOldestBucketPromise,
      overrideMiddleBucketPromise,
    ]);
  } catch (error) {
    console.log(error);
    // It should be handled like a db transaction, but for now, if fails we
    // clean buckets
  }
};

const compareWithLastAvailableBikes = async (citybikesData) => {
  const loadedLastAvailableBikes = await loadBikes();
  if (!loadedLastAvailableBikes) return;

  const { stations: currentStations } = citybikesData;
  const { stations: lastStationsSaved, updatesCount: lastUpdatesCount = 0 } =
    loadedLastAvailableBikes;

  const stationsWereUpdated = checkIfStationsChange(
    currentStations,
    lastStationsSaved
  );

  if (!stationsWereUpdated) return;

  let updatesCount = lastUpdatesCount + 1;

  // It avoids infinite files, Could be in a cache instance instead of files,
  // but for simplicity
  if (lastUpdatesCount === 2) {
    await sortAvailablesBikesFiles();
    updatesCount = 2;
  } else {
    const newNameForLastAvailableBikesFile = `available-bikes-${updatesCount}.json`;
    await renameFile(buildPath(newNameForLastAvailableBikesFile));
  }

  const dataForLastAvailableBikesData = { ...citybikesData, updatesCount };
  await storeBikes(dataForLastAvailableBikesData);
};

const getAvailableBikesByTime = async (socket, timeRange) => {
  let loadedBikes = await loadBikes(
    buildPath({ fileName: `available-bikes-${timeRange}.json` })
  );

  // Load last saved bikes data
  if (!loadedBikes) {
    loadedBikes = await loadBikes();
  }
  socket.emit("available-bikes-by-time", loadedBikes);
};

module.exports = {
  loadAvailableBikes,
  getCurrentAvailableBikes,
  getAvailableBikesByTime,
};
