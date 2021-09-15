const availableBikesItervalInHours = 1;

const compareTimestamp = (lastTimestamp, currentTimestamp) => {
  const currentHour = new Date(currentTimestamp).getMilliseconds();
  const lastHour = new Date(lastTimestamp).getMilliseconds();
  return lastHour + availableBikesItervalInHours <= currentHour;
};

const checkIfStationsChange = (currentStations, lastStationsSaved) =>
  currentStations.some((cStation) =>
    lastStationsSaved.some((lStation) => {
      if (lStation.id === cStation.id) {
        return compareTimestamp(lStation.timestamp, cStation.timestamp);
      }
    })
  );

module.exports = {
  checkIfStationsChange,
};
