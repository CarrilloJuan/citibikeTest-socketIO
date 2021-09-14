const axios = require("axios").default;

const citybikeurl = "http://api.citybik.es/v2/networks/decobike-miami-beach";

const getAvailableBikes = async () => {
  try {
    const { data } = await axios.get(citybikeurl);
    return data.network;
  } catch (error) {
    console(error);
  }
};

module.exports = {
  getAvailableBikes,
};

let interval;
