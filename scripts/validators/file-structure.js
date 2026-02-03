const path = require('path');
const { fileExists, directoryExists, getAllGameDirectories } = require('../utils/file-utils');

/**
 * Required files for every game
 */
const REQUIRED_FILES = [
  'page.tsx',
  'layout.tsx',
  'metadata.ts',
  'config.ts',
  'types.ts',
  'constants.ts',
];

/**
 * Required directories for every game
 */
const REQUIRED_DIRECTORIES = [
  'components',
  'hooks',
  'logic',
];

/**
 * Required hook files in the hooks directory
 */
const REQUIRED_HOOKS = [
  'hooks/useGameState.ts',
  'hooks/useGameLogic.ts',
];

/**
 * Validate file structure for all games
 * @param {string} gamesDir - Path to src/app/games directory
 * @returns {Array} Array of violations
 */
function validateFileStructure(gamesDir) {
  const violations = [];
  const gameDirectories = getAllGameDirectories(gamesDir);

  if (gameDirectories.length === 0) {
    violations.push({
      rule: 'GAMES_DIRECTORY_EMPTY',
      game: 'N/A',
      message: `No game directories found in ${gamesDir}`,
      expected: 'At least one game directory',
      actual: '0 game directories',
    });
    return violations;
  }

  gameDirectories.forEach(gameName => {
    const gameDir = path.join(gamesDir, gameName);

    // Check required files
    REQUIRED_FILES.forEach(requiredFile => {
      const filePath = path.join(gameDir, requiredFile);
      if (!fileExists(filePath)) {
        violations.push({
          rule: 'MISSING_REQUIRED_FILE',
          game: gameName,
          message: `Missing required file: ${requiredFile}`,
          expected: `File exists at ${path.relative(process.cwd(), filePath)}`,
          actual: 'File does not exist',
        });
      }
    });

    // Check required directories
    REQUIRED_DIRECTORIES.forEach(requiredDir => {
      const dirPath = path.join(gameDir, requiredDir);
      if (!directoryExists(dirPath)) {
        violations.push({
          rule: 'MISSING_REQUIRED_DIRECTORY',
          game: gameName,
          message: `Missing required directory: ${requiredDir}/`,
          expected: `Directory exists at ${path.relative(process.cwd(), dirPath)}`,
          actual: 'Directory does not exist',
        });
      }
    });

    // Check required hook files
    REQUIRED_HOOKS.forEach(requiredHook => {
      const hookPath = path.join(gameDir, requiredHook);
      if (!fileExists(hookPath)) {
        violations.push({
          rule: 'MISSING_REQUIRED_HOOK',
          game: gameName,
          message: `Missing required hook: ${requiredHook}`,
          expected: `File exists at ${path.relative(process.cwd(), hookPath)}`,
          actual: 'File does not exist',
        });
      }
    });
  });

  return violations;
}

module.exports = {
  validateFileStructure,
  REQUIRED_FILES,
  REQUIRED_DIRECTORIES,
  REQUIRED_HOOKS,
};
