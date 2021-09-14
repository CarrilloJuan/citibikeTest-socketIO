const fs = require("fs");
const fsPromises = fs.promises;
const { buildPath } = require("../utils/fs");

const defaultFileName = "available-bikes.json";
const defaultDir = __dirname;
const defaultFilePath = buildPath({
  fileName: defaultFileName,
  dir: defaultDir,
});

const renameFile = async (fileName, currentPath = defaultFilePath) => {
  const newPath = buildPath({ fileName, dir: defaultDir });
  try {
    await fsPromises.rename(currentPath, newPath);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const storeBikes = async (data, path = defaultFilePath) => {
  try {
    await fsPromises.writeFile(path, JSON.stringify(data));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const loadBikes = async ({ path = defaultFilePath, fileName } = {}) => {
  let filePath = path;
  if (fileName) {
    filePath = buildPath({ fileName, dir: defaultDir });
  }
  try {
    const data = await fsPromises.readFile(filePath);
    return JSON.parse(data.toString());
  } catch (error) {
    console.log(error);
    return false;
  }
};

const updateBikes = async (data, path = defaultFilePath) => {
  try {
    await fsPromises.appendFile(path, data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const storeAvailableBikes = async (availableBikes) => {
  const lastBikes = await loadBikes();
  if (!lastBikes) {
    storeBikes(availableBikes);
  }
};

module.exports = {
  storeBikes,
  loadBikes,
  updateBikes,
  storeAvailableBikes,
  renameFile,
};
