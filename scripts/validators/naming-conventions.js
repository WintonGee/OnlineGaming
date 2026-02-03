const path = require('path');
const fs = require('fs');
const { getAllGameDirectories } = require('../utils/file-utils');

/**
 * Naming convention patterns
 */
const PATTERNS = {
  // kebab-case: lowercase letters, numbers, and hyphens only
  KEBAB_CASE: /^[a-z0-9]+(-[a-z0-9]+)*$/,

  // PascalCase: starts with uppercase, can contain uppercase and lowercase letters
  PASCAL_CASE: /^[A-Z][a-zA-Z0-9]*$/,

  // camelCase: starts with lowercase, can contain uppercase and lowercase letters
  CAMEL_CASE: /^[a-z][a-zA-Z0-9]*$/,

  // Hook naming: starts with "use" followed by PascalCase
  HOOK_NAME: /^use[A-Z][a-zA-Z0-9]*$/,

  // lowercase only (for specific required files and directories)
  LOWERCASE: /^[a-z]+$/,

  // lowercase with hyphens (alternative for some files)
  LOWERCASE_HYPHEN: /^[a-z]+(-[a-z]+)*$/,
};

/**
 * Required files with their expected naming patterns
 */
const REQUIRED_FILE_NAMES = {
  'page.tsx': 'lowercase',
  'layout.tsx': 'lowercase',
  'metadata.ts': 'lowercase',
  'config.ts': 'lowercase',
  'types.ts': 'lowercase',
  'constants.ts': 'lowercase',
};

/**
 * Required directories with their expected naming patterns
 */
const REQUIRED_DIR_NAMES = {
  'components': 'lowercase',
  'hooks': 'lowercase',
  'logic': 'lowercase',
  'utils': 'lowercase',
  'data': 'lowercase',
};

/**
 * Check if a string matches kebab-case pattern
 */
function isKebabCase(str) {
  return PATTERNS.KEBAB_CASE.test(str);
}

/**
 * Check if a string matches PascalCase pattern
 */
function isPascalCase(str) {
  return PATTERNS.PASCAL_CASE.test(str);
}

/**
 * Check if a string matches camelCase pattern
 */
function isCamelCase(str) {
  return PATTERNS.CAMEL_CASE.test(str);
}

/**
 * Check if a hook name follows the convention (useCamelCase)
 */
function isValidHookName(str) {
  return PATTERNS.HOOK_NAME.test(str);
}

/**
 * Check if a string is lowercase only
 */
function isLowercase(str) {
  return PATTERNS.LOWERCASE.test(str);
}

/**
 * Get all files in a directory recursively
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  try {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      } else {
        arrayOfFiles.push(filePath);
      }
    });

    return arrayOfFiles;
  } catch (error) {
    return arrayOfFiles;
  }
}

/**
 * Get all subdirectories in a directory (non-recursive, one level only)
 */
function getImmediateSubdirectories(dirPath) {
  try {
    return fs.readdirSync(dirPath).filter(item => {
      const fullPath = path.join(dirPath, item);
      return fs.statSync(fullPath).isDirectory();
    });
  } catch (error) {
    return [];
  }
}

/**
 * Validate naming conventions for all games
 */
function validateNamingConventions(gamesDir) {
  const violations = [];
  const gameDirectories = getAllGameDirectories(gamesDir);

  gameDirectories.forEach(gameName => {
    const gameDir = path.join(gamesDir, gameName);

    // 1. Validate game directory name (must be kebab-case)
    if (!isKebabCase(gameName)) {
      violations.push({
        rule: 'GAME_DIR_NOT_KEBAB_CASE',
        game: gameName,
        message: `Game directory name must be kebab-case`,
        expected: 'kebab-case (lowercase with hyphens, e.g., "tic-tac-toe")',
        actual: gameName,
      });
    }

    // 2. Validate subdirectory names (components, hooks, logic, utils, data)
    const subdirs = getImmediateSubdirectories(gameDir);
    subdirs.forEach(subdir => {
      // Check if it's a known required directory
      if (REQUIRED_DIR_NAMES[subdir]) {
        if (!isLowercase(subdir)) {
          violations.push({
            rule: 'SUBDIR_NOT_LOWERCASE',
            game: gameName,
            message: `Subdirectory "${subdir}" must be lowercase`,
            expected: 'lowercase only',
            actual: subdir,
          });
        }
      } else {
        // For non-required directories, they should still be lowercase or kebab-case
        if (!isLowercase(subdir) && !isKebabCase(subdir)) {
          violations.push({
            rule: 'SUBDIR_INVALID_NAME',
            game: gameName,
            message: `Subdirectory "${subdir}" must be lowercase or kebab-case`,
            expected: 'lowercase or kebab-case',
            actual: subdir,
          });
        }
      }
    });

    // 3. Validate component file names (must be PascalCase.tsx)
    const componentsDir = path.join(gameDir, 'components');
    if (fs.existsSync(componentsDir)) {
      const componentFiles = fs.readdirSync(componentsDir).filter(file => {
        const filePath = path.join(componentsDir, file);
        return fs.statSync(filePath).isFile() && (file.endsWith('.tsx') || file.endsWith('.ts'));
      });

      componentFiles.forEach(file => {
        const baseName = file.replace(/\.(tsx|ts)$/, '');
        if (!isPascalCase(baseName)) {
          violations.push({
            rule: 'COMPONENT_NOT_PASCAL_CASE',
            game: gameName,
            message: `Component file "${file}" must be PascalCase`,
            expected: 'PascalCase.tsx (e.g., "GameBoard.tsx")',
            actual: file,
          });
        }

        // Components should be .tsx not .ts
        if (file.endsWith('.ts') && !file.endsWith('.tsx')) {
          violations.push({
            rule: 'COMPONENT_WRONG_EXTENSION',
            game: gameName,
            message: `Component file "${file}" should use .tsx extension`,
            expected: `${baseName}.tsx`,
            actual: file,
          });
        }
      });
    }

    // 4. Validate hook file names (must be useCamelCase.ts)
    const hooksDir = path.join(gameDir, 'hooks');
    if (fs.existsSync(hooksDir)) {
      const hookFiles = fs.readdirSync(hooksDir).filter(file => {
        const filePath = path.join(hooksDir, file);
        return fs.statSync(filePath).isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'));
      });

      hookFiles.forEach(file => {
        const baseName = file.replace(/\.(tsx|ts)$/, '');
        if (!isValidHookName(baseName)) {
          violations.push({
            rule: 'HOOK_INVALID_NAME',
            game: gameName,
            message: `Hook file "${file}" must follow useCamelCase naming convention`,
            expected: 'useCamelCase.ts (e.g., "useGameState.ts")',
            actual: file,
          });
        }
      });
    }

    // 5. Validate logic file names (should be camelCase.ts or kebab-case.ts)
    const logicDir = path.join(gameDir, 'logic');
    if (fs.existsSync(logicDir)) {
      const logicFiles = fs.readdirSync(logicDir).filter(file => {
        const filePath = path.join(logicDir, file);
        return fs.statSync(filePath).isFile() && file.endsWith('.ts');
      });

      logicFiles.forEach(file => {
        const baseName = file.replace(/\.ts$/, '');
        // Logic files should be camelCase or kebab-case (lowercase patterns)
        if (!isCamelCase(baseName) && !isKebabCase(baseName)) {
          violations.push({
            rule: 'LOGIC_INVALID_NAME',
            game: gameName,
            message: `Logic file "${file}" must be camelCase or kebab-case`,
            expected: 'camelCase.ts or kebab-case.ts (e.g., "game.ts" or "tile-movement.ts")',
            actual: file,
          });
        }

        // Logic files should not be .tsx
        if (file.endsWith('.tsx')) {
          violations.push({
            rule: 'LOGIC_WRONG_EXTENSION',
            game: gameName,
            message: `Logic file "${file}" should use .ts extension (no JSX in logic)`,
            expected: file.replace('.tsx', '.ts'),
            actual: file,
          });
        }
      });
    }

    // 6. Validate utils file names (should be camelCase.ts or kebab-case.ts)
    const utilsDir = path.join(gameDir, 'utils');
    if (fs.existsSync(utilsDir)) {
      const utilFiles = fs.readdirSync(utilsDir).filter(file => {
        const filePath = path.join(utilsDir, file);
        return fs.statSync(filePath).isFile() && file.endsWith('.ts');
      });

      utilFiles.forEach(file => {
        const baseName = file.replace(/\.ts$/, '');
        if (!isCamelCase(baseName) && !isKebabCase(baseName)) {
          violations.push({
            rule: 'UTILS_INVALID_NAME',
            game: gameName,
            message: `Utils file "${file}" must be camelCase or kebab-case`,
            expected: 'camelCase.ts or kebab-case.ts (e.g., "helpers.ts")',
            actual: file,
          });
        }
      });
    }

    // 7. Validate required file names in game root
    Object.keys(REQUIRED_FILE_NAMES).forEach(requiredFile => {
      const filePath = path.join(gameDir, requiredFile);
      if (fs.existsSync(filePath)) {
        // File exists, check if name is exactly as expected (already lowercase)
        const actualName = path.basename(filePath);
        if (actualName !== requiredFile) {
          violations.push({
            rule: 'REQUIRED_FILE_WRONG_NAME',
            game: gameName,
            message: `Required file has incorrect name`,
            expected: requiredFile,
            actual: actualName,
          });
        }
      }
    });
  });

  return violations;
}

module.exports = {
  validateNamingConventions,
  isKebabCase,
  isPascalCase,
  isCamelCase,
  isValidHookName,
  PATTERNS,
};
