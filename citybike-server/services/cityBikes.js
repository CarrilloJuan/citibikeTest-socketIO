const axios = require("axios").default;

const citybikeurl = "http://api.citybik.es/v2/networks/decobike-miami-beach";

const getAvailableBikes = async (socket) => {
  try {
    const reponse = await axios.get(citybikeurl);
    const citybikeData = reponse?.data?.network;
    if (socket) {
      socket.emit("available-bikes", citybikeData);
    }
    return citybikeData;
  } catch (error) {
    console(error);
  }
};

module.exports = {
  getAvailableBikes,
};
