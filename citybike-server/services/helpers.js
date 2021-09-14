process.env.TZ = "EDT";
const availableBikesItervalInHours = 4;

const compareTimestamp = (lastTimestamp, currentTimestamp) => {
  const currentHour = new Date(currentTimestamp).getHours();
  const lastHour = new Date(lastTimestamp).getHours();
  return lastHour + availableBikesItervalInHours <= currentHour;
};

const checkIfTimestampChange = (currentStations, lastStationsSaved) => {
  let wereUpdated = false;
  currentStations.forEach((cStation) => {
    wereUpdated = lastStationsSaved.some((lStation) => {
      if (lStation.id === cStation.id) {
        return compareTimestamp(lStation.timestamp, cStation.timestamp);
      }
    });
  });
  return wereUpdated;
};

module.exports = {
  checkIfTimestampChange,
};
