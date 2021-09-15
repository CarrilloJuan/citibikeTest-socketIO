const fs = require("fs");
const fsPromises = fs.promises;
const { buildPath } = require("../utils/fs");

const defaultFileName = "last-available-bikes.json";
const defaultFilePath = buildPath({
  fileName: defaultFileName,
});

// TODO: Add error handling
const storeBikes = async (data, filePath = defaultFilePath) => {
  try {
    await fsPromises.writeFile(filePath, JSON.stringify(data));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const loadBikes = async (filePath = defaultFilePath) => {
  try {
    const data = await fsPromises.readFile(filePath);
    return JSON.parse(data.toString());
  } catch (error) {
    return false;
  }
};

const updateBikes = async (data, filePath = defaultFilefilePath) => {
  try {
    await fsPromises.appendFile(filePath, data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const removeFile = async (filePath) => {
  try {
    await fsPromises.unlink(filePath);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const renameFile = async (newFilePath, currentPath = defaultFilePath) => {
  try {
    await fsPromises.rename(currentPath, newFilePath);
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
  removeFile,
};
