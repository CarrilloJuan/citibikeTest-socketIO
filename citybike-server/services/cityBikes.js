const axios = require("axios").default;

const { loadBikes, renameFile, storeBikes, removeFile } = require("../db/db");
const { checkIfStationsChange, getStats } = require("./helpers");
const { buildPath } = require("../utils/fs");

const CITY_BIKE_URL =
  process.env.CITY_BIKE_URL ||
  "http://api.citybik.es/v2/networks/decobike-miami-beach";

const loadAvailableBikes = async (socket) => {
  try {
    const reponse = await axios.get(CITY_BIKE_URL);
    const citybikesData = reponse?.data?.network;
    const { updatesCount: lastUpdatesCount = 0 } = await loadBikes();

    await storeBikes({ ...citybikesData, updatesCount: lastUpdatesCount });

    const stats = getStats(citybikesData.stations);
    socket.emit("current-available-bikes", { ...citybikesData, stats });
  } catch (error) {
    console.log(error);
  }
};

const getCurrentAvailableBikes = async (socket) => {
  try {
    const reponse = await axios.get(CITY_BIKE_URL);
    const citybikesData = reponse?.data?.network;

    const stats = getStats(citybikesData.stations);
    socket.emit("current-available-bikes", { ...citybikesData, stats });

    compareWithLastAvailableBikes(citybikesData);
    return citybikesData;
  } catch (error) {
    console.log(error);
  }
};

const sortAvailablesBikesFiles = async () => {
  const oldRangeTimeFile = "available-bikes-1.json";
  const middleRangeTimeFile = "available-bikes-2.json";
  const lastUpdate = "last-available-bikes.json";

  try {
    const [dataOldRangeTime, dataMiddleRangeTime] = await Promise.all([
      await loadBikes(buildPath({ fileName: middleRangeTimeFile })),
      await loadBikes(buildPath({ fileName: lastUpdate })),
    ]);

    // Override the oldest time range of available bikes
    const overrideOldestBucketPromise = storeBikes(
      dataOldRangeTime,
      buildPath({ fileName: oldRangeTimeFile })
    );

    // Override the middle time range of available bikes
    const overrideMiddleBucketPromise = storeBikes(
      dataMiddleRangeTime,
      buildPath({ fileName: middleRangeTimeFile })
    );

    await Promise.all([
      overrideOldestBucketPromise,
      overrideMiddleBucketPromise,
    ]);

    return true;
  } catch (error) {
    console.log(error);
    // It should be handled like a db transaction and rollback the changes, but
    // for now, if fails we clean buckets
    await Promise.all([
      removeFile(buildPath({ fileName: oldRangeTimeFile })),
      removeFile(buildPath({ fileName: middleRangeTimeFile })),
    ]);

    return false;
  }
};

const MAX_BUCKETS = 2;
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

  let updatesCount;
  const isLimitedByMaxBuckets = lastUpdatesCount >= MAX_BUCKETS;

  // It avoids infinite files, could be in a cache instance instead of files,
  // but for simplicity, if there is an error reset the count
  if (isLimitedByMaxBuckets && !(await sortAvailablesBikesFiles())) {
    updatesCount = 0;
  } else {
    updatesCount = isLimitedByMaxBuckets
      ? lastUpdatesCount
      : lastUpdatesCount + 1;
    const newNameForLastAvailableBikesFile = `available-bikes-${updatesCount}.json`;
    await renameFile(buildPath({ fileName: newNameForLastAvailableBikesFile }));
  }

  const dataForLastAvailableBikesData = { ...citybikesData, updatesCount };
  await storeBikes(dataForLastAvailableBikesData);
};

const getAvailableBikesByTime = async (socket, timeRange) => {
  let availableBikesForTime;

  if (timeRange === "current") {
    availableBikesForTime = await loadBikes();
  } else {
    availableBikesForTime = await loadBikes(
      buildPath({ fileName: `available-bikes-${timeRange}.json` })
    );
  }

  // When cannot load data for time, them load last saved data
  if (!availableBikesForTime) {
    const { updatesCount: lastUpdatesCount } = await loadBikes();
    availableBikesForTime = await loadBikes(
      buildPath({ fileName: `available-bikes-${lastUpdatesCount}.json` })
    );
  }

  const stats = getStats(availableBikesForTime.stations);
  socket.emit("available-bikes-by-time", { ...availableBikesForTime, stats });
};

module.exports = {
  loadAvailableBikes,
  getCurrentAvailableBikes,
  getAvailableBikesByTime,
};
