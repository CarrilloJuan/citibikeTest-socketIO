const timeToUpdate = 1000;

const compareLastUpdateBaseOnTimestamp = (lastTimestamp, currentTimestamp) => {
  const currentDate = new Date(currentTimestamp);
  const lastDate = new Date(lastTimestamp);
  const diffInMillis = currentDate.getTime() - lastDate.getTime();

  return diffInMillis > timeToUpdate;
};

const checkIfStationsChange = (currentStations, lastStationsSaved) =>
  currentStations.some((cStation) =>
    lastStationsSaved.some((lStation) => {
      if (lStation.id === cStation.id) {
        return compareLastUpdateBaseOnTimestamp(
          lStation.timestamp,
          cStation.timestamp
        );
      }
    })
  );

const getStats = (stations = []) =>
  stations.reduce(
    (acc, s) => ({
      ...acc,
      emptySlots: acc.emptySlots + s.empty_slots,
      freeBikes: acc.freeBikes + s.free_bikes,
    }),
    { emptySlots: 0, freeBikes: 0 }
  );

module.exports = {
  checkIfStationsChange,
  getStats,
};
