const path = require("path");

const defaultDir = path.join(__dirname, "../db/data");

const buildPath = ({ fileName, dir = defaultDir } = {}) => `${dir}/${fileName}`;

module.exports = {
  buildPath,
};
