const fs = require('fs');
const path = require('path');

/**
 * Check if a file exists
 * @param {string} filePath - Path to the file
 * @returns {boolean}
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch (error) {
    return false;
  }
}

/**
 * Check if a directory exists
 * @param {string} dirPath - Path to the directory
 * @returns {boolean}
 */
function directoryExists(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * Get all subdirectories in a directory
 * @param {string} dirPath - Path to the directory
 * @returns {string[]} Array of directory names (not full paths)
 */
function getSubdirectories(dirPath) {
  try {
    if (!directoryExists(dirPath)) {
      return [];
    }
    return fs.readdirSync(dirPath).filter(item => {
      const fullPath = path.join(dirPath, item);
      return fs.statSync(fullPath).isDirectory();
    });
  } catch (error) {
    return [];
  }
}

/**
 * Get all game directories from src/app/games
 * @param {string} gamesDir - Path to games directory
 * @returns {string[]} Array of game directory names
 */
function getAllGameDirectories(gamesDir) {
  return getSubdirectories(gamesDir);
}

module.exports = {
  fileExists,
  directoryExists,
  getSubdirectories,
  getAllGameDirectories,
};
